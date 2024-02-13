import knex from "../config/knex";


class Tutor {
    static TUTOR_TABLE = "tutor"
    static APPOINTMENT_TABLE = 'appointment'

    static async findAvailableTutorsByTime(time?: number) {
        const subquery = knex(this.APPOINTMENT_TABLE).select('tutor_id').where({start_time:time,student_id:!null})
        return await knex(this.TUTOR_TABLE).select('*').whereIn('id', subquery)
    }

    static async findAvailableTutorsByDay(day: number) {
        const subquery = knex(this.APPOINTMENT_TABLE).select('tutor_id')
        .whereBetween('start_time',[day,day+86400000]) // adding number of milliseconds in a day
        return await knex(this.TUTOR_TABLE).select('*').whereIn('id', subquery)
    }

    static async findAvailableTutorsByWeek(week: number) {
        const subquery = knex(this.APPOINTMENT_TABLE).select('tutor_id')
        .whereBetween('start_time',[week,week+604800000]) // adding number of milliseconds in a week
        return await knex(this.TUTOR_TABLE).select('*').whereIn('id', subquery)
    }
}

export default Tutor