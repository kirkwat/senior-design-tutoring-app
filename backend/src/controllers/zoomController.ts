import { Request, Response } from "express";
import axios from "axios";
import Zoom from "../models/Zoom";

export const handleZoomOauth = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (code) {
    try {
      // Request access token if authorization code is present
      const zoomAuthRequest = await axios.post(
        "https://zoom.us/oauth/token",
        `grant_type=authorization_code&code=${encodeURIComponent(code as string)}&redirect_uri=${encodeURIComponent(process.env.ZOOM_REDIRECT_URL || "")}`,

        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString("base64")}`,
          },
        },
      );
      const { access_token, refresh_token } = await zoomAuthRequest.data;

      // Get current user information from Zoom
      const zoomUser = await axios.get(`https://api.zoom.us/v2/users/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const me = await zoomUser?.data;

      const { id: zoom_user_id, email } = me;

      const existingUser = await Zoom.getCurrentZoomUser(zoom_user_id);

      // Check if user exists before creating a new entry in database
      if (!existingUser || Object.keys(existingUser).length === 0) {
        await Zoom.createNewZoomUser({
          zoom_user_id,
          access_token,
          refresh_token,
          email,
        });
        return res.json({ message: "Zoom token retrieved" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error registering new Zoom oauth user" });
    }
  } else {
    // Request authorization code in preparation for access token request
    return res.redirect(
      `https://zoom.us/oauth/authorize?response_type=code&client_id=${encodeURIComponent(process.env.ZOOM_CLIENT_ID || "")}&redirect_uri=${encodeURIComponent(process.env.ZOOM_REDIRECT_URL || "")}`,
    );
  }
  return null;
};
