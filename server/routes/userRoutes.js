import express from 'express';
import { getUserById, getUserResume, loginUser, registeredUser } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

// Registration is a POST endpoint. Return a helpful method response for direct browser checks.
userRouter.get('/register', (req, res) => {
  res.set('Allow', 'POST');
  return res.status(405).json({
    message: 'Registration endpoint is available. Submit a POST request with name, email, and password.',
  });
});
userRouter.post('/register', registeredUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResume);

export default userRouter;
