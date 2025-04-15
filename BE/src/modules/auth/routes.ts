import { Router } from 'express';
import { register, login, logout, getMe } from './controller';
import validationMiddleware from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from './validation-schema';
import { loginLimiter, registerLimiter } from '../middlewares/rate-limit.middleware';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validationMiddleware(registerSchema), registerLimiter, register);
router.post('/login', validationMiddleware(loginSchema),login);

//secure (prevents CSRF attack)
router.post('/logout', isAuthenticated, logout);

//insecure (for testing purposes): csrf attack
// router.post('/logout', logout);

router.get('/me', getMe);

export default router;
