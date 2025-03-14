import * as yup from 'yup';

export const videoFileSchema = yup.mixed()
  .test('is-file-or-url', 'Video file or URL is required', function (value) {
    if (!value) return false;
    if (typeof value === 'string' && value.length > 0) return true; // Valid URL

    // Formidable file object check
    if (typeof value === 'object' && (value.filepath || value instanceof File)) return true;

    return false;
  })
  .test('is-valid-file-type', 'File must be a valid video format (MP4, WEBM, OGG, or QuickTime)', function (value) {
    if (typeof value === 'object' && (value.mimetype || value.type)) {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
      return validVideoTypes.includes(value.mimetype ?? value.type);
    }
    return true; // Skip validation for URLs
  })
  .test('is-valid-url', 'Invalid video URL', function (value) {
    if (typeof value === 'string' && value.length > 0) {
      try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:'; // Ensure only web URLs are accepted
      } catch (error) {
        return false; // Invalid URLs should fail validation
      }
    }
    return true; // Skip validation for Formidable files
  });

export const imageFileSchema = yup.mixed()
  .test('is-file-or-url', 'Image file or URL is required', function (value) {
    if (!value) return false;
    if (typeof value === 'string' && value.length > 0) return true; // Valid URL

    // Formidable file object check
    if (typeof value === 'object' && (value.filepath || value instanceof File)) return true;

    return false;
  })
  .test('is-valid-file-type', 'File must be a valid image (JPEG, PNG, WEBP, or GIF)', function (value) {
    if (typeof value === 'object' && (value.mimetype || value.type)) {
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
      return validImageTypes.includes(value.mimetype ?? value.type);
    }
    return true; // Skip validation for URLs
  })
  .test('is-valid-url', 'Invalid image URL', function (value) {
    if (typeof value === 'string' && value.length > 0) {
      try {
        new URL(value);
        return true;
      } catch (error) {
        return false;
      }
    }
    return true; // Skip validation for Formidable files
  })
