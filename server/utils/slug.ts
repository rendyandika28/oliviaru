import slugify from 'slugify';
import { createId } from '@paralleldrive/cuid2';

export function generateUniqueSlug(title: string): string {
  return slugify(`${title}-${createId()}`, { lower: true, strict: true });
}
