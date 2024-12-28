import { request } from '../hoc/request';
import { config } from '../config/config';
import {BankerSignUpDto, BankerListReturnDTO} from '../types/dto/banker.dto';

const BASE_URL = config.apiUrl;
export const bankerService = {
  // 행원 회원가입 등록
  registerBanker: ( data: BankerSignUpDto) => {
    return request<void>({
      method: 'POST',
      url: `${BASE_URL}/bankers/signUp`,
      data,
    });
  },
  // 이메일 인증
  sendVerificationCode:(email:string)=>{
    return request<string>({
      method: 'POST',
      url: `${BASE_URL}/bankers/banker-send-verification-code`,
      params: email ? {email}:{}
    });
  },
    // 이메일 인증 코드 검증
    verifyEmail:(email:string, code:string)=>{
      return request<string>({
        method: 'POST',
        url: `${BASE_URL}/bankers/banker-verify-email`,
        params: email&&code ? {email,code}:{}
      });
    },
  // 지역구 행원 목록 보기
  getBankerList: (location:string)=>{
    return request<BankerListReturnDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/bankers/profileList`,
      params: location ? { location } : {}
    })
  }
}; 