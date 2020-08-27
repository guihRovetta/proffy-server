import { Request, Response, NextFunction } from 'express';

import { ErrorHandler } from '../helpers/error';

import ConnectionsRepository from '../repositories/ConnectionsRepository';

const connectionsRepository = new ConnectionsRepository();

export default class ConnectionsController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const totalConnections = await connectionsRepository.count();

      const { total } = totalConnections[0];

      return response.json({ total });
    } catch {
      const error = new ErrorHandler(
        400,
        'Unexpected error while counting number of connections'
      );
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { user_id } = request.body;

      await connectionsRepository.create(user_id);

      return response.status(201).json();
    } catch {
      const error = new ErrorHandler(400, 'Unable to create this connection');
      next(error);
    }
  }
}
