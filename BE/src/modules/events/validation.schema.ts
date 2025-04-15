import { z } from "zod";

export const createEventSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: "Event name is required.",
      })
      .max(30),

    description: z.string().min(5, {
      message: "Description must be at least 10 characters.",
    }),
    startDateTime: z.string({
      required_error: "A date of birth is required.",
    }),
    endDateTime: z.string({
      required_error: "A date of birth is required.",
    }),
    categories: z.array(z.string()).nonempty("categories is required"),
  })
  .refine((data) => new Date(data.startDateTime) < new Date(data.endDateTime), {
    message: "Start time must be earlier than end time.",
    path: ["end"],
  });

export const updateEventSchema = createEventSchema;

export const deleteEventSchema = z.object({
  id: z.string(),
});

export const getEventsSchema = z.object({
  limit: z.number().min(1).max(50),
  offset: z.number().min(1),
  categories: z.array(z.string()).optional(),
});


export const seedEventSchema = z.object({
  length: z.number().min(1).max(50),
});
