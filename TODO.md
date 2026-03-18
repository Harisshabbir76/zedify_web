# Hero Slides Desktop/Mobile Images Update - Approved Plan

## Progress Tracker

✅ **Done** | ⏳ **In Progress** | ⬜ **Todo**

**Backend Updates:**
✅ [1] Update HeroSlide model: Add desktopImage/mobileImage fields
✅ [2] Update heroRoutes.js: Handle dual image uploads with multer.fields()

**Frontend Updates:**
✅ [3] Update HeroManagement.js: Add two upload fields, previews, rec sizes (Desktop 1920x800, Mobile 390x500)
✅ [4] Update HeroSlider.js: Responsive image selection (mobileImage on <=768px)
- ⬜ [5] Update heroSlider.css: Responsive enhancements

**Testing & Followup:**
- ⬜ [6] Test uploads, display on desktop/mobile
- ⬜ [7] Restart servers, verify responsive switching

**Notes:** Existing slides use single image → Map to desktopImage on edit.

