import { Request, Response, NextFunction } from 'express';

import { ErrorHandler } from '../helpers/error';

import FavoritesRepository from '../repositories/FavoritesRepository';
import UsersRepository from '../repositories/UsersRepository';

const favoritesRepository = new FavoritesRepository();
const usersRepository = new UsersRepository();

export default class FavoritesController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const user_id = request.userId;

      try {
        const favoriteUsers = await favoritesRepository.findAll(
          Number(user_id)
        );

        return response.status(201).json(favoriteUsers);
      } catch {
        throw new ErrorHandler(
          400,
          'Unexpected error while listing your favorites proffys'
        );
      }
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { proffy_id } = request.body;

      const user_id = Number(request.userId);

      try {
        const user = await usersRepository.findById(user_id);

        if (!user) {
          throw new ErrorHandler(400, 'User not found');
        }

        const proffy = await usersRepository.findById(proffy_id);

        if (!proffy) {
          throw new ErrorHandler(400, 'Proffy not found');
        }

        await favoritesRepository.create(user_id, proffy_id);

        return response.status(201).json();
      } catch {
        throw new ErrorHandler(
          400,
          'Unexpected error while adding this proffy to your favorite list'
        );
      }
    } catch (error) {
      next(error);
    }
  }
}
