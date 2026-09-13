import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, isAdmin, updateSettings);

export default router;
