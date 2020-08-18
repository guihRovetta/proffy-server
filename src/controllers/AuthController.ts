import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import db from '../database/connection';

interface User {
  id: number;
  email: string;
  password: string;
}

export default class AuthController {
  async authenticate(request: Request, response: Response) {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        error: 'Missing fields to login',
      });
    }

    const users = await db('users').where('email', email).select('users.*');

    if (users.length === 0) {
      return response.status(401).json({
        error: 'Verify your email and password',
      });
    }

    const user = users[0] as User;

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return response.status(401).json({
        error: 'Verify your email and password 2',
      });
    }

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1d' });

    delete user.password;

    return response.json({ user, token });
  }
}
