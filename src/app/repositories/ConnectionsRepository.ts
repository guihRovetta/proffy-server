import db from '../../database/connection';

export default class ConnectionsRepository {
  async count() {
    return await db('connections').count('* as total');
  }

  async create(user_id: number) {
    const trx = await db.transaction();

    try {
      const insertedIds = await trx('connections').insert({ user_id });

      await trx.commit();

      return insertedIds;
    } catch {
      await trx.rollback();

      throw new Error('Unable to create connection');
    }
  }
}
