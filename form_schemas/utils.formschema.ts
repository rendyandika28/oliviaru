import * as yup from 'yup';

export const pdfFileSchema = yup.mixed()
  .nullable()
  .notRequired()
  .test('is-valid-file-type', 'File must be a valid PDF document', function (value) {
    if (!value) return true; // skip if empty
    if (typeof value === 'string' && value.length > 0) return true;
    if (typeof value === 'object' && (value.filepath || value instanceof File)) {
      const validPdfType = "application/pdf";
      return (value.mimetype ?? value.type) === validPdfType;
    }
    return false;
  }).test('file-size', 'PDF must be less than 5MB', function (value) {
    if (!value || typeof value === 'string') return true; // skip size check for URLs or empty
    const maxSize = 5 * 1024 * 1024; // 5MB
    return value.size && value.size <= maxSize;
  });

export const videoFileSchema = yup.mixed()
  .nullable()
  .notRequired()
  .test('is-valid-file-type', 'File must be a valid video format (MP4, WEBM, OGG, or QuickTime)', function (value) {
    if (!value) return true; // skip if empty
    if (typeof value === 'string' && value.length > 0) return true;
    if (typeof value === 'object' && (value.filepath || value instanceof File)) {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
      return validVideoTypes.includes(value.mimetype ?? value.type);
    }
    return false;
  });

export const imageFileSchema = yup.mixed()
  .test('is-file-or-url', 'Image file or URL is required', function (value) {
    if (!value) return false;
    if (typeof value === 'string' && value.length > 0) return true; // Accept any non-empty string as valid path
    if (typeof value === 'object' && (value.filepath || value instanceof File)) return true;
    return false;
  })
  .test('is-valid-file-type', 'File must be a valid image (JPEG, PNG, WEBP, or GIF)', function (value) {
    if (typeof value === 'object' && (value.mimetype || value.type)) {
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
      return validImageTypes.includes(value.mimetype ?? value.type);
    }
    return true; // Skip file-type validation for string URLs/paths
  });
