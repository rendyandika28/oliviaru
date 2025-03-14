import { H3Event } from 'h3';
import formidable from 'formidable';
import type { ValidationError } from 'yup';


/**
 * Parse multipart form data with improved processing of nested fields
 * @param event - H3Event object from Nuxt
 * @returns Promise with processed form data
 */
export const parsingForm = async <T>(event: H3Event): Promise<T> => {
  const form = formidable({ multiples: true });

  // Parse the form
  return await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) {
        reject({ statusCode: 500, body: 'Error parsing form data' });
        return;
      }

      // Process fields - first unwrap single-item arrays
      const unwrappedFields = {};
      for (const key in fields) {
        if (Array.isArray(fields[key]) && fields[key].length === 1) {
          unwrappedFields[key] = fields[key][0];
        } else {
          unwrappedFields[key] = fields[key];
        }
      }

      // Process nested objects
      const processedFields = processNestedFields(unwrappedFields);

      // Process files - unwrap single-item arrays
      const processedFiles = {};
      for (const key in files) {
        if (Array.isArray(files[key]) && files[key].length === 1) {
          processedFiles[key] = files[key][0]; // Unwrap single files from arrays
        } else {
          processedFiles[key] = files[key];
        }
      }

      // Combine processed fields and files
      const result = {
        ...processedFields,
        ...processedFiles
      };

      resolve(result as T);
    });
  });
};

/**
 * Process nested fields and convert them to structured objects
 * @param fields - Unwrapped form fields
 * @returns Object with structured nested fields
 */
function processNestedFields(fields: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  const nestedFieldsMap: Map<string, Map<string, Record<string, any>>> = new Map();

  // First pass: identify nested fields and regular fields
  for (const key in fields) {
    // Match nested array pattern like 'subclasses[0].title'
    const nestedMatch = key.match(/^([a-zA-Z0-9_]+)\[(\d+)\]\.([a-zA-Z0-9_]+)$/);

    if (nestedMatch) {
      const [, prefix, indexStr, property] = nestedMatch;
      const index = parseInt(indexStr, 10);

      // Initialize maps if they don't exist
      if (!nestedFieldsMap.has(prefix)) {
        nestedFieldsMap.set(prefix, new Map());
      }

      const prefixMap = nestedFieldsMap.get(prefix)!;
      if (!prefixMap.has(indexStr)) {
        prefixMap.set(indexStr, {});
      }

      // Set property value
      prefixMap.get(indexStr)![property] = fields[key];
    } else {
      // Regular field
      result[key] = fields[key];
    }
  }

  // Second pass: convert nested maps to arrays
  for (const [prefix, prefixMap] of nestedFieldsMap) {
    // Create array and sort by index
    const nestedArray = Array.from(prefixMap.entries())
      .sort(([aIdx], [bIdx]) => parseInt(aIdx, 10) - parseInt(bIdx, 10))
      .map(([, value]) => value);

    // Add array to result
    result[prefix] = nestedArray;
  }

  return result;
}

/**
 * TransformYupErrorsIntoObject
 *
 * @description Transform the useless yup error into a useable validation object
 * @param {ValidationError} errors Yup validation errors
 * @returns {Record<string, string>} Validation errors
 */
export const transformYupErrorsIntoObject = (errors: ValidationError): Record<string, string> => {
  const validationErrors: Record<string, string> = {};

  errors.inner.forEach((error: any) => {
    if (error.path !== undefined) {
      validationErrors[error.path] = error.errors[0];
    }
  });

  return validationErrors;
};
