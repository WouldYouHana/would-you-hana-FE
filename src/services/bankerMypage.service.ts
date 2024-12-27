import { config } from "../config/config";
import { request } from "../hoc/request";
import { BankerInfoResponeDTO, BankerInfoUpdateDTO } from "../types/dto/mypage.dto";

const BASE_URL = config.apiUrl;

export const bankerMypageService = {
    // 행원 개인정보 수정 전 필드에 표시할 기존 정보 불러오기
    getBankerMyPageInfo: (bankerId: number) => {
        return request<BankerInfoResponeDTO>({
            method: 'GET',
            url: `${BASE_URL}/my/bankers/edit/info`,
            params: {
                bankerId: bankerId.toString()
            }
        });
    },
    // 행원 개인정보 수정 제출
    modifyBankerInfo:(bankerId:number, data:BankerInfoUpdateDTO)=>{
      return request<BankerInfoResponeDTO>({
        method: 'PUT',
        url: `${BASE_URL}/my/bankers/edit/info/submit`,
        params: {
            bankerId: bankerId.toString()
        },
        data
    });
    },
    // 행원 프로필 수정
    modifyBankerProfile: (data: FormData) => {
        return request<string>({
          method: 'POST',
          url: `${BASE_URL}/my/bankers/mypage/modifyProfile`,
          data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      },
}