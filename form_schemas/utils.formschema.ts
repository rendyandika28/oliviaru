import * as yup from 'yup';

export const videoFileSchema = yup.mixed()
  .test('is-file-or-url', 'Video file or URL is required', function (value) {
    return value instanceof File || (typeof value === 'string' && value.length > 0);
  })
  .test('is-valid-file-type', 'File must be a valid video format (MP4, WEBM, OGG, or QuickTime)', function (value) {
    if (value instanceof File) {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
      return validVideoTypes.includes(value.type);
    }
    return true; // Skip validation if it's a string (URL)
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
    return true; // Skip validation if it's a File
  })

export const imageFileSchema = yup.mixed()
  .test('is-file-or-url', 'Image file or URL is required', function (value) {
    return value instanceof File || (typeof value === 'string' && value.length > 0);
  })
  .test('is-valid-file-type', 'File must be a valid image (JPEG, PNG, WEBP, or GIF)', function (value) {
    if (value instanceof File) {
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
      return validImageTypes.includes(value.type);
    }
    return true; // Skip validation if it's a string (URL)
  })
  .test('is-valid-url', 'Invalid image URL', function (value) {
    if (typeof value === 'string' && value.length > 0) {
      try {
        new URL(value);
        return true;
      } catch (error) {
        // If it's not a URL but still a string, we'll accept it as a file path
        return true;
      }
    }
    return true; // Skip validation if it's a File
  })
