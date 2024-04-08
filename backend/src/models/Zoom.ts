import knex from "../config/knex";
import { refreshOauthToken } from "../utils/zoom";

export default class Zoom {
  static ZOOM_TABLE = "zoom_credentials";
  static USER_TABLE = "user";
  static APPOINTMENT_TABLE = "appointment";

  static getCurrentZoomUser = async (zoom_user_id: string) => {
    return knex(this.ZOOM_TABLE).where({ zoom_user_id }).first();
  };

  static getZoomUserById = async (tutor_id: number) => {
    return knex(this.ZOOM_TABLE).where({ tutor_id }).first();
  };

  static findZoomUserByAppointmentId = async (appointmentId: number) => {
    const tutorId = await knex(this.APPOINTMENT_TABLE)
      .select("tutor_id")
      .where({ id: appointmentId })
      .first();

    if (!tutorId?.tutor_id) {
      throw new Error("Appointment or tutor not found");
    }

    const zoomCredentials = await await knex(this.ZOOM_TABLE)
      .select("zoom_user_id", "access_token", "refresh_token", "last_updated")
      .where({ tutor_id: tutorId.tutor_id })
      .first();
    if (!zoomCredentials) {
      throw new Error("Zoom credentials for the tutor not found");
    }
    return zoomCredentials;
  };

  static createNewZoomUser = async ({
    zoom_user_id,
    access_token,
    refresh_token,
    email,
  }: {
    zoom_user_id: string;
    access_token: string;
    refresh_token: string;
    email: string;
  }) => {
    const user = await knex(this.USER_TABLE).where({ email }).first();

    if (!user) {
      throw new Error("User with the provided email does not exist.");
    }

    await knex(this.ZOOM_TABLE).insert({
      zoom_user_id,
      access_token,
      refresh_token,
      tutor_id: user.id,
      last_updated: Date.now(),
    });

    return { success: true };
  };

  static updateZoomUserToken = async ({
    zoom_user_id,
    refresh_token: old_refresh_token,
  }: {
    zoom_user_id: string;
    refresh_token: string;
  }) => {
    try {
      const { access_token, refresh_token } = await refreshOauthToken({
        old_refresh_token,
      });

      if (!access_token || !refresh_token) {
        return { message: "Error refreshing Zoom token" };
      }

      await knex(this.ZOOM_TABLE).where({ zoom_user_id }).update({
        access_token,
        refresh_token,
        last_updated: Date.now(),
      });

      return { message: "Zoom token refresh successful" };
    } catch (error) {
      console.error(error);
      return { message: "Error refreshing Zoom token" };
    }
  };
}
