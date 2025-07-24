// import * as yup from 'yup';
import { object, string, array } from "yup";

import { imageFileSchema, pdfFileSchema, videoFileSchema } from './utils.formschema';

// Subclass schema
const subclassSchema = object({
  title: string().required().label("Judul Materi"),
  description: string().required().label("Deskripsi Materi"),
  video_url: videoFileSchema,
  attachment_url: pdfFileSchema,
}).test(
  'at-least-one-required',
  'Either a video or an attachment is required.',
  function (value) {
    const { video_url, attachment_url } = value || {};

    const hasVideo = !!video_url;
    const hasAttachment = !!attachment_url;
    return hasVideo || hasAttachment;
  }
);

const formSchema = object({
  title: string().required().label("Judul Kelas"),
  description: string().required().label("Deskripsi Kelas"),
  thumbnail_url: imageFileSchema.label("Thumbnail Kelas"),
  status: string().required().label("Status Kelas"),
  subclasses: array()
    .of(subclassSchema)
    .min(1, 'Minimal has 1 material.')
    .default([]),
}).required()

export default formSchema;
