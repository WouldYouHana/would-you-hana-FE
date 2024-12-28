import { request } from '../hoc/request';
import { config } from '../config/config';
import { User, InterestLocationRequestDTO  } from '../types/user';
import { CustomerInfoRequestDTO, CustomerInfoResponseDTO } from '../types/dto/mypage.dto';

const BASE_URL = config.apiUrl;
export const userService = {
  // 일반회원 회원가입 등록
  registerUser: ( data: User) => {
    return request<void>({
      method: 'POST',
      url: `${BASE_URL}/members/signUp`,
      data,
    });
  },
  // 이메일 인증
  sendVerificationCode: (email: string) => {
    return request<string>({
      method: 'POST',
      url: `${BASE_URL}/members/send-verification-code`,
      params: email ? { email } : {}
    });
  },
  // 이메일 인증 코드 검증
  verifyEmail: (email: string, code: string) => {
    return request<string>({
      method: 'POST',
      url: `${BASE_URL}/members/verify-email`,
      params: email && code ? { email, code } : {}
    });
  },
  // 일반회원 관심지역 받아오기
  getInterestLocationList: (customer_id: number) => {
    return request<string[]>({
      method: 'GET',
      url: `${BASE_URL}/my/interestList`,
      params: customer_id ? {customer_id: customer_id.toString()} : {}
    })
  },

  // 일반회원 관심지역 삭제하기
  deleteSpecificInterestLocation: (data: InterestLocationRequestDTO) => {
    return request<string[]>({
      method: 'DELETE',
      url: `${BASE_URL}/my/delete/interest`,
      data,
    })
  },

  // 일반 회원 관심지역 추가하기
  addSpecificInterestLocation: (data: InterestLocationRequestDTO) => {
    return request<string[]>({
      method: 'POST',
      url: `${BASE_URL}/my/add/interest`,
      data,
    })
  },

  // 일반 회원 정보 조회
  getCustomerInfo: (customerId: number) => {
    return request<CustomerInfoResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/my/edit/info`,
      params: customerId ? {customerId: customerId.toString()} : {}
    })
  },

  // 일반 회원 정보 수정
  updateCustomerInfo: (data: CustomerInfoRequestDTO, customerId: number) => {
    return request<void>({
      method: 'PUT',
      url: `${BASE_URL}/my/edit/info/submit`,
      data,
      params: customerId ? {customerId: customerId.toString()} : {}
    })
  },
 
}; 