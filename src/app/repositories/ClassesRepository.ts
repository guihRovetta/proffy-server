import db from '../../database/connection';

export default class ClassesRepository {
  async findAll(
    week_day: number,
    time: number,
    subject: string,
    limit: number = 5,
    page: number = 1
  ) {
    return await db('classes')
      .whereExists(function () {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [week_day])
          .whereRaw('`class_schedule`.`from` <= ??', [time])
          .whereRaw('`class_schedule`.`to` > ??', [time]);
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*'])
      .limit(limit)
      .offset((page - 1) * limit);
  }

  async findById(id: number) {
    return await db('classes').where('user_id', id).first();
  }

  async findClassSchedule(user_id: number) {
    return await db('classes')
      .where('classes.user_id', user_id)
      .join('class_schedule', 'class_schedule.class_id', '=', 'classes.id')
      .select(['class_schedule.*']);
  }
}
