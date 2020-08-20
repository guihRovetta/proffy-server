import express from 'express';

import authMiddleware from './app/middlewares/authMiddleware';

import ClassesController from './app/controllers/ClassesController';
import ConnectionsController from './app/controllers/ConnectionsController';
import UsersController from './app/controllers/UsersController';
import AuthController from './app/controllers/AuthController';
import FavoritesController from './app/controllers/FavoritesController';

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
routes.post('/forgot', authController.forgotPassword);

routes.get('/favorites', authMiddleware, favoritesController.index);
routes.post('/favorites', authMiddleware, favoritesController.create);

export default routes;
