import { config } from "../config/config";
import { request } from "../hoc/request";
import { CustomerInfoResponseDTO, CustomerInfoUpdateDTO } from "../types/dto/mypage.dto";

const BASE_URL = config.apiUrl;

export const customerMypageService = {
  //  개인정보 수정 전 필드에 표시할 기존 정보 불러오기
  getMyPageInfo: (customerId: number) => {
    return request<CustomerInfoResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/my/edit/info`,
      params: {
        customerId: customerId.toString()
      }
    });
  },
  //  개인정보 수정 제출
  modifyMyPageInfo: (customerId: number, data: CustomerInfoUpdateDTO) => {
    return request<string>({
      method: 'PUT',
      url: `${BASE_URL}/my/edit/info/submit`,
      params: {
        customerId: customerId.toString()
      },
      data
    });
  }
}