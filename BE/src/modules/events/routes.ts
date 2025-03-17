import { Router } from "express";
import validationMiddleware from "../middlewares/validation.middleware";
import {
  createEventSchema,
  deleteEventSchema,
  updateEventSchema,
} from "./validation.schema";
import {
  createEvent,
  deleteEvents,
  getAllEvents,
  getCategories,
  seedCategories,
  seedEvents,
  updateEvents,
} from "./controller";

const router = Router();
const basePath = "/events";
router.post(
  `${basePath}`,
  validationMiddleware(createEventSchema, "body"),
  createEvent
);
router.post(`${basePath}/get-all`, getAllEvents);

router.patch(
  `${basePath}/update/:id`,
  validationMiddleware(updateEventSchema, "body"),
  updateEvents
);

router.delete(
  `${basePath}/:id`,
  validationMiddleware(deleteEventSchema, "params"),
  deleteEvents
);

router.post(`${basePath}/seed-category`, seedCategories);

router.get(`${basePath}/categories`, getCategories);

router.post(`${basePath}/seed-events`, seedEvents);

export const eventRouter = router;
