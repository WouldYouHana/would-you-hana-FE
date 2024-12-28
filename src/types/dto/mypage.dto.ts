
// 일반 회원 정보 조회
export interface CustomerInfoResponseDTO {
  // 수정 불가능 필드
  customerName: string;
  customerEmail: string;

  // 수정 가능 필드
  nickname: string;
  birthDate?: string;
  gender?: string;
  location?: string;
  phone: string;
}

// 일반 회원 정보 수정
export interface CustomerInfoRequestDTO {
    password?: string;
    nickname: string;
    birthDate: string;
    gender: string;
    location: string;
    phone: string;
}

export interface BankerInfoResponeDTO {
    bankerName: string;
    bankerEmail: string;
    branchName: string;
}

export interface BankerInfoUpdateDTO {
    password:string;
    branchName: string;
}

export interface CustomerInfoUpdateDTO{
    password:string;
    nickname:string;
    birthDate?:string;
    gender?:string;
    location?:string;
    phone:string;
}