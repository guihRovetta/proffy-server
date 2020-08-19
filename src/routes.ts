import express from 'express';

import authMiddleware from './middlewares/authMiddleware';

import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import UsersController from './controllers/UsersController';
import AuthController from './controllers/AuthController';

const routes = express.Router();

const classesController = new ClassesController();
const connectionsController = new ConnectionsController();
const usersController = new UsersController();
const authController = new AuthController();

routes.get('/classes', classesController.index);
routes.post('/classes', authMiddleware, classesController.create);
routes.put('/classes', authMiddleware, classesController.update);

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

routes.get('/users/:id', authMiddleware, usersController.show);
routes.post('/users', usersController.create);

routes.post('/auth', authController.authenticate);

export default routes;
