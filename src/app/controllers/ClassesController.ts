import { Request, Response } from 'express';

import db from '../../database/connection';

import ClassesRepository from '../repositories/ClassesRepository';
import UsersRepository from '../repositories/UsersRepository';
import convertHourToMinutes from '../utils/convertHourToMinutes';

const classesRepository = new ClassesRepository();
const usersRepository = new UsersRepository();

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

    const trx = await db.transaction();

    try {
      await trx('users').where('id', id).update({
        avatar,
        whatsapp,
        bio,
      });

      const user_id = user.id;

      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        user_id,
      });

      const class_id = insertedClassesIds[0];

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });

      await trx('class_schedule').insert(classSchedule);

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

    if (!name || !lastname || !email || !subject || !cost || !schedule) {
      return response.status(400).json({
        error: 'Missing fields to update user info',
      });
    }

    const id = Number(request.userId);

    const userClass = await usersRepository.findById(id);
    const class_id = userClass.id;

    const trx = await db.transaction();

    try {
      await trx('users').where('id', id).update({
        name,
        lastname,
        email,
        avatar,
        whatsapp,
        bio,
      });

      await trx('classes').where('id', class_id).update({
        subject,
        cost,
      });

      await trx('class_schedule').where('class_id', class_id).del();

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });

      await trx('class_schedule').insert(classSchedule);

      await trx.commit();

      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while creating new class',
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
