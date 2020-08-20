import { Request, Response } from 'express';
import FavoritesRepository from '../repositories/FavoritesRepository';
import UsersRepository from '../repositories/UsersRepository';

const favoritesRepository = new FavoritesRepository();
const usersRepository = new UsersRepository();

export default class FavoritesController {
  async index(request: Request, response: Response) {
    const user_id = request.userId;

    try {
      const favoriteUsers = await favoritesRepository.findAll(Number(user_id));

      return response.status(201).json(favoriteUsers);
    } catch {
      return response.status(400).json({
        message: 'Unexpected error while listing your favorites proffys',
      });
    }
  }

  async create(request: Request, response: Response) {
    const { proffy_id } = request.body;

    const user_id = Number(request.userId);

    try {
      const user = await usersRepository.findById(user_id);

      if (!user) {
        return response.status(400).json({ message: 'Proffy not found.' });
      }

      await favoritesRepository.create(user_id, proffy_id);

      return response.status(201).json();
    } catch {
      return response.status(400).json({
        error: 'Unexpected error while creating new user',
      });
    }
  }
}
