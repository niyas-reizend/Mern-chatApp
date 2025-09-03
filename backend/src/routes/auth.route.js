import express, { Router } from "express";
import { handleCheckAuth, handleLogin, handleLogout, handleSignup, handleUpdateProfile } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

const authRoutes = express.Router();


authRoutes.post('/signup',handleSignup);
authRoutes.post('/login',handleLogin);
authRoutes.post('/logout',handleLogout);
authRoutes.get('/checkAuth',authenticate,handleCheckAuth);
authRoutes.put('/update-profile', authenticate,handleUpdateProfile);

export default authRoutes
  