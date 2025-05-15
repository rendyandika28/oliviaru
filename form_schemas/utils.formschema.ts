import * as yup from 'yup';

export const videoFileSchema = yup.mixed()
  .test('is-file-or-url', 'Video file or URL is required', function (value) {
    if (!value) return false;
    if (typeof value === 'string' && value.length > 0) return true; // Accept any non-empty string as valid path
    if (typeof value === 'object' && (value.filepath || value instanceof File)) return true;
    return false;
  })
  .test('is-valid-file-type', 'File must be a valid video format (MP4, WEBM, OGG, or QuickTime)', function (value) {
    if (typeof value === 'object' && (value.mimetype || value.type)) {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
      return validVideoTypes.includes(value.mimetype ?? value.type);
    }
    return true; // Skip file-type validation for string URLs/paths
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
