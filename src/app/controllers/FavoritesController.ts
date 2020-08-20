import { Request, Response } from 'express';
import db from '../../database/connection';

export default class FavoritesController {
  async index(request: Request, response: Response) {
    const user_id = request.userId;

    try {
      const favoriteUsers = await db('favorites')
        .where('favorites.user_id', '=', user_id)
        .join('users', 'favorites.proffy_id', '=', 'users.id')
        .select(
          'users.id',
          'users.name',
          'users.lastname',
          'users.email',
          'users.avatar',
          'users.whatsapp',
          'users.bio'
        );

      return response.status(201).json(favoriteUsers);
    } catch {
      return response.status(400).json({
        message: 'Unexpected error while listing your favorites proffys',
      });
    }
  }

  async create(request: Request, response: Response) {
    const { proffy_id } = request.body;

    const user_id = request.userId;

    const user = await db('users').where('id', proffy_id).first();

    if (!user) {
      return response.status(400).json({ message: 'Proffy not found.' });
    }

    try {
      await db('favorites').insert({ user_id, proffy_id });

      return response.status(201).json();
    } catch {
      return response.status(400).json({
        error: 'Unexpected error while creating new user',
      });
    }
  }
}
