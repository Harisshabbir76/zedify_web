const express = require('express');
const router = express.Router();

// GET /verify-whatsapp/:phone - Verify WhatsApp number
router.get('/verify-whatsapp/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    
    // Check admin number config
    const adminPhone = process.env.WHATSAPP_ADMIN_NUMBER;
    if (!adminPhone) {
      return res.status(500).json({ success: false, error: 'WHATSAPP_ADMIN_NUMBER not configured in .env' });
    }
    
    // Generate WhatsApp URL to admin number with customer phone info
    // Admin can then message the customer
    const whatsappApiUrl = `https://wa.me/${adminPhone}?text=Customer%20phone:%20${phone}%20needs%20verification`;

    res.json({
      success: true,
      hasWhatsApp: true, // In a real implementation, you'd check this
      whatsappUrl: whatsappApiUrl
    });
  } catch (error) {
    console.error('WhatsApp verification error:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

module.exports = router;
