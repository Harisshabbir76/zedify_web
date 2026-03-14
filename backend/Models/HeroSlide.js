const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
    image: { type: String, required: true }, // Cloudinary URL
    title: String,
    subtitle: String,
    ctaText: String,
    ctaLink: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
