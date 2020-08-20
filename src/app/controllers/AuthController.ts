import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

import db from '../../database/connection';

import MailProvider from '../providers/MailProvider';

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

  async forgotPassword(request: Request, response: Response) {
    const { email } = request.body;

    const userExists = await db('users')
      .where('email', email)
      .select('*')
      .first();

    if (!userExists) {
      return response.status(400).json({
        error: 'This user do not exists, please check your email! ',
      });
    }

    const trx = await db.transaction();

    try {
      let resetedPassword = v4();
      resetedPassword = resetedPassword.substr(0, 8);

      const encryptedPassword = bcrypt.hashSync(resetedPassword, 8);

      const mailProvider = new MailProvider();
      const emailMessage = {
        from: '"Equipe Proffy" <support@proffy.com>',
        to: email,
        subject: 'Redefinição de senha',
        text: `Olá, somos da equipe de suporte da Proffy, esse email foi enviado para sua redefinição de senha, que no momento é essa ${resetedPassword}`,
        html: `<h1>Olá, parece que você resetou sua senha</h1> <h4>Somos da equipe de suporte da Proffy e esse email foi enviado para sua redefinição de senha </h4> <p>Sua nova senha é a seguinte: <strong>${resetedPassword}</strong></p>`,
      };

      try {
        const emailResponse = await mailProvider.sendMail(emailMessage);
        console.log(emailResponse);

        await trx('users')
          .where('email', email)
          .update('password', encryptedPassword);

        await trx.commit();

        return response.status(201).json({
          message: emailResponse,
        });
      } catch {
        await trx.rollback();

        return response.status(400).json({
          error: 'Unexpected error while sending your email',
        });
      }
    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while sending your email',
      });
    }
  }
}
