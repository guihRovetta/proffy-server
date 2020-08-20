import db from '../../database/connection';

export default class FavoritesRepository {
  async findAll(user_id: number) {
    return await db('favorites')
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
  }

  async create(user_id: number, proffy_id: number) {
    return await db('favorites').insert({ user_id, proffy_id });
  }
}
