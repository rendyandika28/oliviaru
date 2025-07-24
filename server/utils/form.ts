import { H3Event } from 'h3'
import formidable from 'formidable'
import type { ValidationError } from 'yup'

/**
 * Parse multipart form data and structure nested fields/files
 * @param event - H3Event object from Nuxt
 * @returns Parsed and structured data
 */
export const parsingForm = async <T>(event: H3Event): Promise<T> => {
  const form = formidable({ multiples: true })

  return await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) {
        reject({ statusCode: 500, body: 'Error parsing form data' })
        return
      }

      // Merge fields and files into one object
      const merged: Record<string, any> = {}

      for (const key in fields) {
        merged[key] = Array.isArray(fields[key]) && fields[key].length === 1
          ? fields[key][0]
          : fields[key]
      }

      for (const key in files) {
        merged[key] = Array.isArray(files[key]) && files[key].length === 1
          ? files[key][0]
          : files[key]
      }

      // Process all merged keys (including nested)
      const result = processNestedFields(merged)

      resolve(result as T)
    })
  })
}

/**
 * Convert flat field names like 'subclasses[0][title]' into structured objects
 * @param fields - Flat key-value object from form data
 * @returns Structured object with nested fields
 */
function processNestedFields(fields: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  const nestedFieldsMap: Map<string, Map<string, Record<string, any>>> = new Map()

  for (const key in fields) {
    // Match pattern like subclasses[0][title]
    const nestedMatch = key.match(/^([a-zA-Z0-9_]+)\[(\d+)\](?:\.?|\[)([a-zA-Z0-9_]+)\]?$/)

    if (nestedMatch) {
      const [, prefix, indexStr, property] = nestedMatch
      const index = parseInt(indexStr, 10)

      if (!nestedFieldsMap.has(prefix)) {
        nestedFieldsMap.set(prefix, new Map())
      }

      const prefixMap = nestedFieldsMap.get(prefix)!
      if (!prefixMap.has(indexStr)) {
        prefixMap.set(indexStr, {})
      }

      prefixMap.get(indexStr)![property] = fields[key]
    } else {
      // Not a nested field
      result[key] = fields[key]
    }
  }

  // Convert each prefix map to array
  for (const [prefix, prefixMap] of nestedFieldsMap) {
    const nestedArray = Array.from(prefixMap.entries())
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([, value]) => value)

    result[prefix] = nestedArray
  }

  return result
}

/**
 * Transform Yup validation errors into object
 * @param errors - Yup ValidationError
 * @returns Object with path-to-error mapping
 */
export const transformYupErrorsIntoObject = (errors: ValidationError): Record<string, string> => {
  const validationErrors: Record<string, string> = {}

  errors.inner.forEach((error: any) => {
    if (error.path !== undefined) {
      validationErrors[error.path] = error.errors[0]
    }
  })

  return validationErrors
}
