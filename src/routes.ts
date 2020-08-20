import express from 'express';

import authMiddleware from './middlewares/authMiddleware';

import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import UsersController from './controllers/UsersController';
import AuthController from './controllers/AuthController';
import FavoritesController from './controllers/FavoritesController';

const routes = express.Router();

const classesController = new ClassesController();
const connectionsController = new ConnectionsController();
const usersController = new UsersController();
const authController = new AuthController();
const favoritesController = new FavoritesController();

routes.get('/classes', classesController.index);
routes.post('/classes', authMiddleware, classesController.create);
routes.put('/classes', authMiddleware, classesController.update);
routes.get('/classes/:id', authMiddleware, classesController.get);

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

routes.get('/users/:id', authMiddleware, usersController.show);
routes.post('/users', usersController.create);

routes.post('/auth', authController.authenticate);

routes.get('/favorites', authMiddleware, favoritesController.index);
routes.post('/favorites', authMiddleware, favoritesController.create);

export default routes;
