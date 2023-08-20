import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import express from 'express';
import { body, validationResult } from 'express-validator';
import * as jwt from 'jsonwebtoken';
import prisma from '../database/prisma';
import { checkAuth } from '../middleware/checkAuth';

dotenv.config();

const router = express.Router();

router.get('/token', async (req, res) => {
  let token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  // eslint-disable-next-line prefer-destructuring
  token = token.split(' ')[1];

  try {
    const user = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    )) as User;

    req.user = user.email;

    return res.json({
      token,
    });
  } catch (e) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
});

router.post(
  '/register',
  body('firstName').isString().withMessage('firstName is a required field'),
  body('lastName').isString().withMessage('lastName is a required field'),
  body('email').isEmail().withMessage('email is a required field'),
  body('password')
    .isLength({ min: 6, max: 70 })
    .withMessage('password must be between 6 and 70 characters'),

  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map(error => {
        return {
          message: error.msg,
        };
      });
      return res.status(422).json({ errors });
    }

    const { firstName, lastName, email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User already exists' }], data: null });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    const token = await jwt.sign(
      { user: newUser },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      },
    );

    return res.status(201).json({
      errors: null,
      data: {
        token,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      },
    });
  },
);

router.post(
  '/login',
  body('email').isEmail().withMessage('email is a required field'),
  body('password').isString(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map(error => {
        return {
          message: error.msg,
        };
      });
      return res.status(422).json({ errors });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email },
      include: { todos: true },
    });

    if (!user) {
      return res.status(401).json({
        errors: [{ message: "User doesn't exist" }],
        data: null,
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        errors: [{ message: 'Invalid credentials' }],
        data: null,
      });
    }

    const token = await jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    );
    return res.status(200).json({
      errors: [],
      data: {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  },
);

router.get('/me', checkAuth, async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { email: req.user },
    include: { todos: true },
  });

  return res.status(200).json({
    errors: [],
    data: {
      user: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
        todos: user?.todos,
      },
    },
  });
});

export default router;