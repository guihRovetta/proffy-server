import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import { ErrorHandler } from '../helpers/error';

import UsersRepository from '../repositories/UsersRepository';

const usersRepository = new UsersRepository();

export default class UsersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, lastname, email, password } = request.body;

      if (!name || !lastname || !email || !password) {
        throw new ErrorHandler(400, 'Missing fields to create user');
      }

      const userExists = await usersRepository.findByEmail(email);

      if (userExists) {
        throw new ErrorHandler(400, 'This e-mail is already in use');
      }

      const user = {
        name,
        lastname,
        email,
        password: bcrypt.hashSync(password, 8),
      };

      try {
        const insertedIds = await usersRepository.create(user);

        const user_id = insertedIds[0];

        delete user.password;

        return response.json({ user_id, ...user });
      } catch {
        throw new ErrorHandler(400, 'Unexpected error while creating new user');
      }
    } catch (error) {}
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const user = await usersRepository.findById(Number(id));

      if (!user) {
        throw new ErrorHandler(400, 'User not found');
      }

      delete user.password;

      return response.json({ user });
    } catch (error) {
      next(error);
    }
  }
}
