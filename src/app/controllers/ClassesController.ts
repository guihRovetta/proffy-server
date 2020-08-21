import { Request, Response } from 'express';

import db from '../../database/connection';

import ClassesRepository from '../repositories/ClassesRepository';
import UsersRepository from '../repositories/UsersRepository';
import ClassScheduleRepository from '../repositories/ClassScheduleRepository';
import convertHourToMinutes from '../utils/convertHourToMinutes';

const classesRepository = new ClassesRepository();
const usersRepository = new UsersRepository();
const classScheduleRepository = new ClassScheduleRepository();

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const subject = filters.subject as string;
    const week_day = Number(filters.week_day);
    const time = filters.time as string;

    const limit = Number(filters.limit);
    const page = Number(filters.page);

    if (!subject || !week_day || !time) {
      return response.status(400).json({
        error: 'Missing filters to search classes',
      });
    }

    const timeInMinutes = convertHourToMinutes(time);

    const classes = await classesRepository.findAll(
      week_day,
      timeInMinutes,
      subject,
      limit,
      page
    );

    return response.json(classes);
  }

  async create(request: Request, response: Response) {
    const { avatar, whatsapp, bio, subject, cost, schedule } = request.body;

    const id = Number(request.userId);

    if (!avatar || !whatsapp || !bio) {
      return response.status(400).json({
        error: 'Missing personal data to create class',
      });
    }

    if (!subject || !cost || !schedule) {
      return response.status(400).json({
        error: 'Missing class data to create class',
      });
    }

    const user = await usersRepository.findById(id);

    if (!user) {
      return response.status(400).json({ message: 'User not found.' });
    }

    const classExists = await classesRepository.findById(id);

    if (classExists) {
      return response.status(400).json({
        message: 'This user already has a class registered, try to update it.',
      });
    }

    let trx = await db.transaction();

    try {
      trx = await usersRepository.update(trx, id, avatar, whatsapp, bio);

      const user_id = user.id;

      const created = await classesRepository.create(
        trx,
        subject,
        cost,
        user_id
      );

      const insertedClassesIds = created.insertedClassesIds;
      trx = created.trx;

      const class_id = insertedClassesIds[0];

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });

      trx = await classScheduleRepository.create(trx, classSchedule);

      await trx.commit();

      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while creating new class',
      });
    }
  }

  async update(request: Request, response: Response) {
    const {
      name,
      lastname,
      email,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule,
    } = request.body;

    if (
      !name ||
      !lastname ||
      !email ||
      !avatar ||
      !whatsapp ||
      !bio ||
      !subject ||
      !cost ||
      !schedule
    ) {
      return response.status(400).json({
        error: 'Missing fields to update user info',
      });
    }

    const id = Number(request.userId);

    const user = await usersRepository.findById(id);
    const user_id = user.id;

    const userClass = await classesRepository.findById(user_id);
    const class_id = userClass.id;

    let trx = await db.transaction();

    try {
      trx = await usersRepository.fullUpdate(
        trx,
        id,
        name,
        lastname,
        email,
        avatar,
        whatsapp,
        bio
      );

      trx = await classesRepository.update(trx, user_id, subject, cost);

      trx = await classScheduleRepository.delete(trx, class_id);

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });

      trx = await classScheduleRepository.create(trx, classSchedule);

      await trx.commit();

      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while updating a class',
      });
    }
  }

  async get(request: Request, response: Response) {
    const { id } = request.params;

    const user_id = Number(id);

    const data = await classesRepository.findClassSchedule(user_id);

    return response.json(data);
  }
}
