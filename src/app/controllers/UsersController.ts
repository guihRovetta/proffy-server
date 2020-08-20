import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import UsersRepository from '../repositories/UsersRepository';

const usersRepository = new UsersRepository();

export default class UsersController {
  async create(request: Request, response: Response) {
    const { name, lastname, email, password } = request.body;

    if (!name || !lastname || !email || !password) {
      return response.status(400).json({
        error: 'Missing fields to create user',
      });
    }

    const userExists = await usersRepository.findByEmail(email);

    if (userExists) {
      return response.status(400).json({
        error: 'This e-mail is already in use',
      });
    }

    try {
      const user = {
        name,
        lastname,
        email,
        password: bcrypt.hashSync(password, 8),
      };

      const insertedIds = await usersRepository.create(user);

      const user_id = insertedIds[0];

      delete user.password;

      return response.json({ user_id, ...user });
    } catch {
      return response.status(400).json({
        error: 'Unexpected error while creating new user',
      });
    }
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const user = await usersRepository.findById(Number(id));

    if (!user) {
      return response.status(400).json({ message: 'User not found.' });
    }

    delete user.password;

    return response.json({ user });
  }
}
