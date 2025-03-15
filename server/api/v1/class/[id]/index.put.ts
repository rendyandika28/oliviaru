import { createId } from '@paralleldrive/cuid2';
import { inArray } from 'drizzle-orm';
import { createReadStream } from 'fs';
import { H3Event } from "h3";
import slugify from 'slugify';
import { InferType } from 'yup';
import formSchema from '~/form_schemas/create-class.formschema';
import { VideoStatusEnum } from '~/server/database/schema';
import { parsingForm, transformYupErrorsIntoObject } from '~/server/utils/form';
import { uploadFile } from '~/server/utils/minio';

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get class ID from URL params
    const id = getRouterParam(event, 'id')
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        message: 'Invalid class ID'
      })
    }

    // Check if class exists
    const existingClass = await useDrizzle().query.classTable.findFirst({
      where: eq(tables.classTable.id, Number(id)),
      with: {
        subClasses: true
      }
    })

    if (!existingClass) {
      throw createError({
        statusCode: 404,
        message: 'Class not found'
      })
    }

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

    // Process thumbnail upload if exists
    let thumbnailUrl = existingClass.thumbnailUrl;
    if (fields.thumbnail_url && typeof fields.thumbnail_url !== 'string') {
      const thumbnailFile = fields.thumbnail_url;
      const thumbnailStream = createReadStream(thumbnailFile.filepath);
      const thumbnailFileName = `thumbnails/${createId()}-${thumbnailFile.originalFilename}`;

      // Upload to MinIO
      thumbnailUrl = await uploadFile(thumbnailStream, thumbnailFileName, thumbnailFile.mimetype);

      // Optional: Delete old thumbnail if needed
      if (existingClass.thumbnailUrl) {
        let _existingThumbnail = existingClass.thumbnailUrl.replace(`${useRuntimeConfig().minioBaseUrl}/${useRuntimeConfig().minioBucket}`, "")
        await deleteFile(_existingThumbnail)
      }
    }

    // Check if title has changed and update slug if needed
    let slug = existingClass.slug;
    if (fields.title !== existingClass.title) {
      slug = slugify(`${fields.title}-${createId()}`, { lower: true });
    }

    // Start a transaction
    return useDrizzle().transaction(async (tx) => {
      // Update class first
      await tx.update(tables.classTable).set({
        title: fields.title,
        slug,
        description: fields.description,
        thumbnailUrl,
        status: fields.status || existingClass.status,
      })
        .where(eq(tables.classTable.id, Number(id)))

      if (fields.subclasses.length === 0) {
        throw new Error('At least one subclass is required');
      }

      // Get existing subclass IDs for comparison
      const existingSubclassIds = existingClass.subClasses.map(subclass => subclass.id)
      const updatedSubclassIds = fields.subclasses
        .filter(subclass => subclass.id)
        .map(subclass => Number(subclass.id))

      // Identify subclasses to delete (exist in DB but not in the update payload)
      const subclassesToDelete = existingSubclassIds.filter(id => !updatedSubclassIds.includes(id))

      // Delete removed subclasses
      if (subclassesToDelete.length > 0) {
        await tx.delete(tables.subClassTable)
          .where(inArray(tables.subClassTable.id, subclassesToDelete))
      }

      // Update or create subclasses
      for (let i = 0; i < fields.subclasses.length; i++) {
        const subClass = fields.subclasses[i]
        const orderIndex = i + 1

        if (subClass.id) {
          // Update existing subclass
          const updateData: any = {
            title: subClass.title,
            description: subClass.description,
            orderIndex
          }

          // Only update video if provided
          if (subClass.video_url) {
            updateData.videoUrl = subClass.video_url
            updateData.videoStatus = VideoStatusEnum.UPLOADED
          }

          await tx.update(tables.subClassTable)
            .set(updateData)
            .where(eq(tables.subClassTable.id, Number(subClass.id)))
        } else {
          // Create new subclass
          const subClassSlug = slugify(`${subClass.title}-${createId()}`, { lower: true })
          let videoStatus = VideoStatusEnum.UPLOADED

          await tx.insert(tables.subClassTable).values({
            title: subClass.title,
            slug: subClassSlug,
            description: subClass.description,
            orderIndex,
            videoUrl: subClass?.video_url,
            videoStatus,
            classId: Number(id)
          })
        }
      }

      return {
        status: 200,
        message: 'Successfully updated class'
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
