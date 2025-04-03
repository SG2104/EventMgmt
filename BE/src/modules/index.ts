import { eventRouter } from './events/routes';
import authRoutes from './auth/routes';

import { Express } from 'express';
import { debugRouter } from './debug-sql/routes';

export const registerModules = (app: Express) => {
  app.use('/api', eventRouter);
  app.use('/api/v1/auth', authRoutes);
  app.use("/api/debug", debugRouter);
};
