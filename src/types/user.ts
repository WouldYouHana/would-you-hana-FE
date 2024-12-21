export interface User {
  email: string;
  password: string;
  nickname: string;
  name: string;
  gender: string;
  phone: string;
  birthDate: string;
  location: string;
  favoriteLocations:string[];
  interests?: string;
}

export interface Banker {
  email: string;
  password: string;
  name: string;
  branchName: string;
  interests: string;
  photo?: string;
  desc?: string;
}

export interface InterestLocationRequestDTO{
  customerId: number;
  location: string;
}