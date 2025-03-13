// import * as yup from 'yup';
import { object, string, array } from "yup";

import { imageFileSchema, videoFileSchema } from './utils.formschema';

// Subclass schema
const subclassSchema = object({
  title: string().required().label("Judul Materi"),
  description: string().required().label("Deskripsi Materi"),
  video_url: videoFileSchema
});

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
