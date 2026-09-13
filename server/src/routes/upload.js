import express from 'express';
import { upload, uploadToCloudinary } from '../middleware/upload.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    const folder = req.query.folder || 'food-court';
    const secureUrl = await uploadToCloudinary(req.file.buffer, folder);

    return res.json({
      url: secureUrl,
      message: 'Image uploaded successfully to Cloudinary.',
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ message: error.message || 'Image upload failed.' });
  }
});

export default router;
