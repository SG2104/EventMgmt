import rateLimit from 'express-rate-limit';

export const registerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per minute
  message: {
    status: 429,
    message: "Too many registration attempts. Please try again later.",
  },
});

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per minute
    message: {
      status: 429,
      message: "Too many registration attempts. Please try again later.",
    },
  });
  
  export const createEventLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // limit each user to 10 event creations per windowMs
    message: "Too many events created from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  export const getAllEventsLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Allow 10 requests per minute per IP
    message: {
      success: false,
      message: "Too many requests. Please wait a minute and try again.",
    },
  });

  export const updateEventLimiter = rateLimit({
    windowMs: 15 * 1000, // 15 seconds
    max: 5,
    message: {
      success: false,
      message: "Too many update attempts. Please wait and try again.",
    },
  });
  
  export const deleteEventLimiter = rateLimit({
    windowMs: 15 * 1000, // 15 seconds
    max: 5,
    message: {
      success: false,
      message: "Too many delete attempts. Please wait and try again.",
    },
  });
  
  // src/modules/middlewares/rate-limit.middleware.ts
export const categoryLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 10,
  message: {
    success: false,
    message: "Too many requests to categories. Please try again later.",
  },
});

export const seedLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,
  message: {
    success: false,
    message: "Seed can be done only once per minute",
  },
});
