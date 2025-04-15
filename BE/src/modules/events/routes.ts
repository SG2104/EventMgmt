import { Router } from "express";
import validationMiddleware from "../middlewares/validation.middleware";
import {
  createEventSchema,
  deleteEventSchema,
  getEventsSchema,
  seedEventSchema,
  updateEventSchema,
} from "./validation.schema";
import {
  getAllEvents,
  createEvent,
  deleteEvents,
  getCategories,
  seedCategories,
  seedEvents,
  updateEvents,
} from "./controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { categoryLimiter, createEventLimiter, deleteEventLimiter, getAllEventsLimiter, seedLimiter, updateEventLimiter } from "../middlewares/rate-limit.middleware";

const router = Router();
const basePath = "/events";
router.post(
  `${basePath}`,
  isAuthenticated,
  createEventLimiter,
  validationMiddleware(createEventSchema, "body"),
  createEvent
);
router.post(
  `${basePath}/get-all`,
  getAllEventsLimiter,
  validationMiddleware(getEventsSchema, "body"),
  getAllEvents
);

router.patch(
  `${basePath}/update/:id`,
  isAuthenticated,
  updateEventLimiter,
  validationMiddleware(updateEventSchema, "body"),
  updateEvents
);

router.delete(
  `${basePath}/:id`,
  isAuthenticated,
  deleteEventLimiter,
  validationMiddleware(deleteEventSchema, "params"),
  deleteEvents
);

router.post(`${basePath}/seed-category`, seedLimiter, seedCategories);

router.get(`${basePath}/categories`, categoryLimiter, getCategories);

router.post(`${basePath}/seed-events`, isAuthenticated, seedLimiter, validationMiddleware(seedEventSchema), seedEvents);

export const eventRouter = router;
