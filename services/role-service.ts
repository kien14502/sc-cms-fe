import { apiClient, apiClientList } from "@/lib/api-client"
import { API_ENDPOINT } from "@/shared/constants"
import type {
  PageParams,
  RoleDetailResponse,
  RoleListItemResponse,
  RoleWriteRequest,
} from "@/shared/interfaces"
import { withQuery } from "@/shared/utils"

export const roleService = {
  list: (params: { name?: string } & PageParams = {}) =>
    apiClientList<RoleListItemResponse>(
      withQuery(API_ENDPOINT.ROLE.LIST, params)
    ),

  detail: (id: number) =>
    apiClient<RoleDetailResponse>(API_ENDPOINT.ROLE.DETAIL(id)),

  create: (payload: RoleWriteRequest) =>
    apiClient<number>(API_ENDPOINT.ROLE.LIST, {
      method: "POST",
      body: JSON.stringify(payload),
      successToast: "Thêm mới nhóm quyền thành công",
    }),

  update: (id: number, payload: RoleWriteRequest) =>
    apiClient<void>(API_ENDPOINT.ROLE.DETAIL(id), {
      method: "PUT",
      body: JSON.stringify(payload),
      successToast: "Cập nhật nhóm quyền thành công",
    }),

  remove: (id: number) =>
    apiClient<void>(API_ENDPOINT.ROLE.DETAIL(id), {
      method: "DELETE",
      successToast: "Xóa nhóm quyền thành công",
    }),
}
