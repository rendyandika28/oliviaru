import type { InferType } from "yup"
import { API_ENDPOINT } from "~/constants/api_endpoint"
import type formSchema from "~/form_schemas/create-class.formschema"
import type { ApiResponse } from "~/types/responses/base_response_type"
import type { ClassData, ClassListResponse } from "~/types/responses/class_response_type"

export function useApiClass() {
  type FormData = InferType<typeof formSchema>

  const getAll = (params?: Ref<Partial<{
    searchQuery: string
  }>>) => {
    return useApi<ClassListResponse>(API_ENDPOINT.ADMIN.CLASS, {
      params
    })
  }

  const getBySlug = (slug: string) => {
    return useApi<ClassListResponse>(`${API_ENDPOINT.ADMIN.CLASS}/${slug}`)
  }

  const getSubclassBySlug = (slug: string) => {
    return useApi<ClassListResponse>(`${API_ENDPOINT.ADMIN.SUBCLASS}/${slug}`)
  }

  const createClass = (payload: FormData, options?: Partial<ApiFetchOptions<ApiResponse<ClassData>>>) => {
    const body = generateFormData<FormData>(payload)
    return useApi(API_ENDPOINT.ADMIN.CLASS, {
      ...options,
      method: 'POST',
      lazy: false,
      body,
    })
  }

  const updateClass = (payload: FormData, slug: string, options?: Partial<ApiFetchOptions<ApiResponse<ClassData>>>) => {
    const body = generateFormData<FormData>(payload)
    return useApi(`${API_ENDPOINT.ADMIN.CLASS}/${slug}`, {
      ...options,
      method: 'PUT',
      lazy: false,
      body,
    })
  }

  const deleteClass = (slug: string, options?: Partial<ApiFetchOptions<ApiResponse<ClassData>>>) => {
    return useApi(`${API_ENDPOINT.ADMIN.CLASS}/${slug}`, {
      ...options,
      method: 'DELETE'
    })
  }



  return {
    getAll,
    getBySlug,
    getSubclassBySlug,
    createClass,
    updateClass,
    deleteClass
  }
}
