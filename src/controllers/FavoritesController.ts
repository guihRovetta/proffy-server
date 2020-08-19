import { Request, Response } from 'express';
import db from '../database/connection';

export default class FavoritesController {
  async create(request: Request, response: Response) {
    const { proffy_id } = request.body;

    const user_id = request.userId;

    const user = await db('users').where('id', proffy_id).first();

    if (!user) {
      return response.status(400).json({ message: 'Proffy not found.' });
    }

    const trx = await db.transaction();

    try {
      await db('favorites').insert({ user_id, proffy_id });

      await trx.commit();

      return response.status(201).json();
    } catch {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while creating new user',
      });
    }
  }
}
