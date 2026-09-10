import { apiClient, apiClientList } from "@/lib/api-client"
import { API_ENDPOINT } from "@/shared/constants"
import type {
  ApiStatus,
  PageParams,
  UserCreateRequest,
  UserDetailResponse,
  UserListItemResponse,
  UserSearchParams,
  UserUpdateRequest,
} from "@/shared/interfaces"
import { withQuery } from "@/shared/utils"

export const userService = {
  list: (params: UserSearchParams & PageParams = {}) =>
    apiClientList<UserListItemResponse>(
      withQuery(API_ENDPOINT.USER.LIST, params)
    ),

  detail: (id: number) =>
    apiClient<UserDetailResponse>(API_ENDPOINT.USER.DETAIL(id)),

  create: (payload: UserCreateRequest) =>
    apiClient<number>(API_ENDPOINT.USER.LIST, {
      method: "POST",
      body: JSON.stringify(payload),
      successToast: "Thêm mới người dùng thành công",
    }),

  update: (id: number, payload: UserUpdateRequest) =>
    apiClient<void>(API_ENDPOINT.USER.DETAIL(id), {
      method: "PUT",
      body: JSON.stringify(payload),
      successToast: "Cập nhật người dùng thành công",
    }),

  remove: (id: number) =>
    apiClient<void>(API_ENDPOINT.USER.DETAIL(id), {
      method: "DELETE",
      successToast: "Xóa người dùng thành công",
    }),

  changeStatus: (id: number, status: ApiStatus) =>
    apiClient<void>(API_ENDPOINT.USER.STATUS(id), {
      method: "PATCH",
      body: JSON.stringify({ status }),
      successToast:
        status === "ACTIVE"
          ? "Kích hoạt người dùng thành công"
          : "Tạm dừng người dùng thành công",
    }),
}
