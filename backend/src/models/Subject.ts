import { sub } from "date-fns";
import knex from "../config/knex";

class Subject {
  static SUBJECT_TABLE = "subject";
  static SUBJECT_LIST_TABLE = "subject_list"

  static async findSubject(subject: string) {
    return knex(this.SUBJECT_LIST_TABLE).select("id").where({ name: subject })
  }

  static async addNewSubject(subject: string){
    return knex(this.SUBJECT_LIST_TABLE).insert({name:subject})
  }

  static async assignTutorToSubject(tutor_id: number, subject: string){
    const id = knex(this.SUBJECT_LIST_TABLE).select("id").where({name:subject})
    return knex(this.SUBJECT_TABLE).insert({tutor_id, subject_id: id})
  }

  static async removeSubjectFromTutor(tutor_id: number, subject: string){
    const id = knex(this.SUBJECT_LIST_TABLE).select("id").where({name:subject})
    return knex(this.SUBJECT_TABLE).where({subject_id: id}).delete()
  }

  static async findAllSubjectsForTutor(tutor_id: number){
    const subject_ids = knex(this.SUBJECT_TABLE).select("subject_id").where({tutor_id})
    return knex(this.SUBJECT_LIST_TABLE).select("name").whereIn("id", subject_ids)
  }
}

export default Subject;