const express = require('express');
const router = express.Router();
const HeroSlide = require('../Models/HeroSlide');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage: storage });

// GET /api/hero-slides - Get all hero slides
router.get('/api/hero-slides', async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching slides' });
  }
});

// POST /api/hero-slides - Create a hero slide
router.post('/api/hero-slides', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink } = req.body;
    const image = req.file.path;
    const slide = new HeroSlide({ image, title, subtitle, ctaText, ctaLink });
    await slide.save();
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ message: 'Error creating slide' });
  }
});

// PUT /api/hero-slides/:id - Update a hero slide
router.put('/api/hero-slides/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, isActive } = req.body;
    const updateData = { title, subtitle, ctaText, ctaLink, isActive };
    if (req.file) updateData.image = req.file.path;
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(slide);
  } catch (err) {
    res.status(500).json({ message: 'Error updating slide' });
  }
});

// DELETE /api/hero-slides/:id - Delete a hero slide
router.delete('/api/hero-slides/:id', async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting slide' });
  }
});

module.exports = router;

