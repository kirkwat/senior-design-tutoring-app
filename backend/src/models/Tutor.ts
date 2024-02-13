import knex from "../config/knex";


class Tutor {
    static TUTOR_TABLE = "tutor";

    static async findAvailableTutorsByTime(time?: number) {
        const subquery = knex('appointment').select('tutor_id').where({start_time:time,student_id:!null})
        return await knex(this.TUTOR_TABLE).select('*').whereIn('id', subquery)
    }
}

export default Tutor