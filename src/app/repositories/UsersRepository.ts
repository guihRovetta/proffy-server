import db from '../../database/connection';
import Knex from 'knex';

interface User {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export default class UsersRepository {
  async findById(user_id: number) {
    return await db('users').where('id', user_id).first();
  }

  async findByEmail(email: string) {
    return await db('users').where('email', email).first();
  }

  async create(user: User) {
    const trx = await db.transaction();

    try {
      const insertedIds = await trx('users').insert(user);

      await trx.commit();

      return insertedIds;
    } catch {
      await trx.rollback();

      throw new Error('Unable to create user');
    }
  }

  async updatePassword(email: string, password: string) {
    const trx = await db.transaction();

    try {
      const updatedIds = await trx('users')
        .where('email', email)
        .update('password', password);

      await trx.commit();

      return updatedIds;
    } catch {
      await trx.rollback();

      throw new Error('Unable to update password');
    }
  }

  async update(
    trx: Knex.Transaction,
    id: number,
    avatar: string,
    whatsapp: string,
    bio: string
  ) {
    await trx('users').where('id', id).update({
      avatar,
      whatsapp,
      bio,
    });

    return trx;
  }

  async fullUpdate(
    trx: Knex.Transaction,
    id: number,
    name: string,
    lastname: string,
    email: string,
    avatar: string,
    whatsapp: string,
    bio: string
  ) {
    await trx('users').where('id', id).update({
      name,
      lastname,
      email,
      avatar,
      whatsapp,
      bio,
    });

    return trx;
  }
}
