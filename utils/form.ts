export const generateFormData = <T = Record<string, unknown | unknown[]>>(
  forms: T
): FormData => {
  const formData = new FormData();

  for (const name in forms) {
    if (Array.isArray(forms[name as keyof T])) {
      (forms[name as keyof T] as unknown[]).forEach((value: any, index) => {
        for (const property in value) {
          formData.append(
            `${name}[${index}][${property}]`,
            value[property] as string | File
          );
        }
      });
    } else {
      formData.append(name, forms[name as keyof T] as string | File);
    }
  }

  return formData;
};
