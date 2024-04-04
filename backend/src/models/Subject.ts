import knex from "../config/knex";

class Subject {
  static SUBJECT_TABLE = "subject";
  static SUBJECT_LIST_TABLE = "subject_list";

  static async updateTutorSubjects(tutor_id: number, subjects: string[]) {
    subjects = subjects.map((s) => s.toLowerCase());

    const currentSubjects = await knex(this.SUBJECT_TABLE)
      .join(
        this.SUBJECT_LIST_TABLE,
        "subject.subject_id",
        "=",
        "subject_list.id",
      )
      .where("subject.tutor_id", tutor_id)
      .select("subject_list.name");

    const currentSubjectNames = currentSubjects.map((s) => s.name);

    const subjectsToAdd = subjects.filter(
      (name) => !currentSubjectNames.includes(name),
    );
    const subjectsToRemove = currentSubjectNames.filter(
      (name) => !subjects.includes(name),
    );

    await Promise.all(
      subjectsToRemove.map(async (name) => {
        const subjectId = await knex(this.SUBJECT_LIST_TABLE)
          .where({ name })
          .select("id");

        await knex(this.SUBJECT_TABLE)
          .where({
            tutor_id,
            subject_id: subjectId[0].id,
          })
          .del();
      }),
    );

    await Promise.all(
      subjectsToAdd.map(async (name) => {
        let subjectEntry = await knex(this.SUBJECT_LIST_TABLE)
          .where({ name })
          .select("id")
          .first();

        if (!subjectEntry) {
          const insertedId = await knex(this.SUBJECT_LIST_TABLE).insert({
            name,
          });

          subjectEntry = { id: insertedId };
        }

        await knex(this.SUBJECT_TABLE).insert({
          tutor_id: tutor_id,
          subject_id: subjectEntry.id,
        });
      }),
    );
  }

  static async findSubject(subject: string) {
    return knex(this.SUBJECT_LIST_TABLE).select("id").where({ name: subject });
  }

  static async addNewSubject(subject: string) {
    return knex(this.SUBJECT_LIST_TABLE).insert({ name: subject });
  }

  static async assignTutorToSubject(tutor_id: number, subject: string) {
    const id = knex(this.SUBJECT_LIST_TABLE)
      .select("id")
      .where({ name: subject });
    return knex(this.SUBJECT_TABLE).insert({ tutor_id, subject_id: id });
  }

  static async removeSubjectFromTutor(tutor_id: number, subject: string) {
    const id = knex(this.SUBJECT_LIST_TABLE)
      .select("id")
      .where({ name: subject });
    return knex(this.SUBJECT_TABLE).where({ subject_id: id }).delete();
  }

  static async findAllSubjectsForTutor(tutor_id: number) {
    const subject_ids = knex(this.SUBJECT_TABLE)
      .select("subject_id")
      .where({ tutor_id });
    return knex(this.SUBJECT_LIST_TABLE)
      .select("name")
      .whereIn("id", subject_ids);
  }
}

export default Subject;
