import { createId } from '@paralleldrive/cuid2';
import { createReadStream } from 'fs';
import { H3Event } from "h3";
import slugify from 'slugify';
import { InferType } from 'yup';
import formSchema from '~/form_schemas/create-class.formschema';
import { ClassStatusEnum, VideoStatusEnum } from '~/server/database/schema';
import { parsingForm, transformYupErrorsIntoObject } from '~/server/utils/form';
import { uploadFile } from '~/server/utils/minio';

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Parse multipart form data
    type FormData = InferType<typeof formSchema>
    const fields = await parsingForm<FormData>(event)

    // Validate the form data
    try {
      await formSchema.validate(fields, { abortEarly: false, strict: true });
    } catch (validationError: any) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: transformYupErrorsIntoObject(validationError)
      });
    }

    // Generate slug from title
    const slug = slugify(`${fields.title}-${createId()}`, { lower: true });

    // Process thumbnail upload if exists
    let thumbnailUrl = null;
    if (fields.thumbnail_url) {
      const thumbnailFile = fields.thumbnail_url;
      const thumbnailStream = createReadStream(thumbnailFile.filepath);
      const thumbnailFileName = `thumbnails/${createId()}-${thumbnailFile.originalFilename}`;

      // Upload to MinIO
      thumbnailUrl = await uploadFile(thumbnailStream, thumbnailFileName, thumbnailFile.mimetype);
    }

    // Start a transaction
    return useDrizzle().transaction(async (tx) => {
      // Create class first
      const insertId = await tx.insert(tables.classTable).values([{
        title: fields.title,
        slug,
        description: fields.description,
        thumbnailUrl,
        status: fields.status || ClassStatusEnum.DRAFT,
      }]).$returningId()

      if (fields.subclasses.length === 0) {
        throw new Error('At least one subclass is required');
      }

      // Create subclasses
      const subClassPromises = fields.subclasses.map(async (subClass, index) => {
        const subClassSlug = slugify(`${subClass.title}-${createId()}`, { lower: true })

        // Process subclass video if exists
        let videoStatus = VideoStatusEnum.UPLOADED;

        return {
          title: subClass.title,
          slug: subClassSlug,
          description: subClass.description,
          orderIndex: index + 1,
          videoUrl: subClass?.video_url,
          videoStatus,
          classId: Number(insertId[0].id),
        };
      });

      const subClassValues = await Promise.all(subClassPromises);
      await tx.insert(tables.subClassTable).values(subClassValues)

      // Return the created class with subclasses
      return {
        status: 200,
        message: 'Successfully creating a class'
      };
    });
  } catch (error) {
    console.error('Error creating class');
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || 'Failed to create class',
      data: error?.data || null,
    });
  }
})
