export const generateFormData = <T extends Record<string, unknown>>(
  forms: T
): FormData => {
  const formData = new FormData();

  for (const name in forms) {
    const fieldValue = forms[name as keyof T];

    if (Array.isArray(fieldValue)) {
      fieldValue.forEach((item: unknown, index: number) => {
        if (item && typeof item === 'object' && !(item instanceof File)) {
          const record = item as Record<string, string | File>;
          for (const property in record) {
            formData.append(
              `${name}[${index}][${property}]`,
              record[property]
            );
          }
        }
      });
    } else if (fieldValue !== null && fieldValue !== undefined) {
      formData.append(name, fieldValue as string | File);
    }
  }

  return formData;
};
