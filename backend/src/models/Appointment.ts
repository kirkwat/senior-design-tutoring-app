import knex from "../config/knex";
import { IAppointment } from "../interfaces/IAppointment";


class Appointment {
    static APPOINTMENT_TABLE = "appointment";

    static findAppoitnmentByTutor(tutor_id: number, start_date: Date){
        const start = start_date.toISOString()
        return knex(this.APPOINTMENT_TABLE).select('*').where({tutor_id,start_time:start_date.getTime()})
    }

    static async createAppointment(newAppointment: Omit<IAppointment, "id">) {
        console.log(newAppointment);
        return await knex<IAppointment>(this.APPOINTMENT_TABLE).insert(newAppointment);
    }

    static async findOpenAppointmentsByTutor(tutor_id?: string) {
        return knex(this.APPOINTMENT_TABLE).select('*').where({tutor_id,student_id:null});
    }
}

export default Appointment