import { H3Event } from 'h3';
import type { InferType } from 'yup';
import formSchema from '~/form_schemas/create-class.formschema';
import { parsingForm, transformYupErrorsIntoObject } from '~/server/utils/form';
import { createClass } from '~/server/services/class.service';
import { ApiResponseFormatter } from '~/utils/api';

export default defineEventHandler(async (event: H3Event) => {
  await requireAdmin(event);

  type FormData = InferType<typeof formSchema>;
  const fields = await parsingForm<FormData>(event);

  try {
    await formSchema.validate(fields, { abortEarly: false, strict: true });
  } catch (validationError: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation error',
      data: transformYupErrorsIntoObject(validationError),
    });
  }

  const result = await createClass(fields);
  return ApiResponseFormatter(201, 'Successfully created class', result);
});
