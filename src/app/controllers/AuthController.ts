import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

import UsersRepository from '../repositories/UsersRepository';
import MailProvider from '../providers/MailProvider';
import { ErrorHandler } from '../helpers/error';

const usersRepository = new UsersRepository();

interface User {
  id: number;
  email: string;
  password: string;
}

export default class AuthController {
  async authenticate(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        throw new ErrorHandler(400, 'Missing fields to login');
      }

      const userExists = await usersRepository.findByEmail(email);

      if (!userExists) {
        throw new ErrorHandler(401, 'Verify your email and password');
      }

      const isValidPassword = await bcrypt.compare(
        password,
        userExists.password
      );

      if (!isValidPassword) {
        throw new ErrorHandler(401, 'Verify your email and password');
      }

      const secret = process.env.JWT_SECRET as string;
      const token = jwt.sign({ id: userExists.id }, secret, {
        expiresIn: '1d',
      });

      delete userExists.password;

      return response.json({ userExists, token });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { email } = request.body;

      const userExists = await usersRepository.findByEmail(email);

      if (!userExists) {
        throw new ErrorHandler(
          400,
          'This user do not exists, please check your email!'
        );
      }

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

      const emailResponse = await mailProvider.sendMail(emailMessage);
      console.log(emailResponse);

      await usersRepository.updatePassword(email, encryptedPassword);

      return response.status(201).json({
        message: emailResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}
