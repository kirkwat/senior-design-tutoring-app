import knex from "../config/knex";

export default class Subject {
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

          subjectEntry = { id: insertedId[0] };
        }

        await knex(this.SUBJECT_TABLE).insert({
          tutor_id: tutor_id,
          subject_id: subjectEntry.id,
        });
      }),
    );
  }
}
