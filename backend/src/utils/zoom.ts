import axios from "axios";

export const refreshOauthToken = async ({
  old_refresh_token,
}: {
  old_refresh_token: string;
}) => {
  try {
    const zoomRefreshTokenRequest = await axios.post(
      "https://zoom.us/oauth/token",
      `grant_type=refresh_token&refresh_token=${encodeURIComponent(old_refresh_token)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString("base64")}`,
        },
      },
    );

    const { data } = zoomRefreshTokenRequest;
    const { access_token, refresh_token } = data;

    return { access_token, refresh_token };
  } catch (error) {
    console.error(error);
    return { message: "Error refreshing Zoom token" };
  }
};
