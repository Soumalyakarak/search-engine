import express from 'express';
import { searchController } from '../controllers/search.controller.js';
import { isAuthenticated } from '../middleware/search.middleware.js';

const router = express.Router();

router.get('/',isAuthenticated, searchController);

export default router;
