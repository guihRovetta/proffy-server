import db from '../../database/connection';
import Knex from 'knex';

interface ScheduleItem {
  class_id: number;
  week_day: number;
  from: string;
  to: string;
}

export default class ClassScheduleRepository {
  async create(trx: Knex.Transaction, classSchedule: ScheduleItem) {
    await trx('class_schedule').insert(classSchedule);

    return trx;
  }

  async delete(trx: Knex.Transaction, class_id: number) {
    await trx('class_schedule').where('class_id', class_id).del();

    return trx;
  }
}
