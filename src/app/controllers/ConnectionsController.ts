import { Request, Response } from 'express';
import db from '../../database/connection';
import ConnectionsRepository from '../repositories/ConnectionsRepository';

const connectionsRepository = new ConnectionsRepository();

export default class ConnectionsController {
  async index(request: Request, response: Response) {
    const totalConnections = await connectionsRepository.count();

    const { total } = totalConnections[0];

    return response.json({ total });
  }

  async create(request: Request, response: Response) {
    const { user_id } = request.body;

    try {
      await connectionsRepository.create(user_id);

      return response.status(201).json();
    } catch {
      return response.status(400).json({
        error: 'Unable to create connection',
      });
    }
  }
}
