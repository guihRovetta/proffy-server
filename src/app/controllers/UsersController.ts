import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import db from '../../database/connection';

export default class UsersController {
  async create(request: Request, response: Response) {
    const { name, lastname, email, password } = request.body;

    if (!name || !lastname || !email || !password) {
      return response.status(400).json({
        error: 'Missing fields to create user',
      });
    }

    const userExists = await db('users')
      .where('email', email)
      .select('users.*');

    if (userExists.length > 0) {
      return response.status(400).json({
        error: 'This e-mail is already in use',
      });
    }

    const trx = await db.transaction();

    try {
      const user = {
        name,
        lastname,
        email,
        password: bcrypt.hashSync(password, 8),
      };

      const insertedIds = await trx('users').insert(user);

      const user_id = insertedIds[0];

      await trx.commit();

      delete user.password;

      return response.json({ user_id, ...user });
    } catch {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while creating new user',
      });
    }
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const user = await db('users').where('id', id).first();

    if (!user) {
      return response.status(400).json({ message: 'User not found.' });
    }

    delete user.password;

    return response.json({ user });
  }
}
