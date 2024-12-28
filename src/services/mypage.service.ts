import { request } from '../hoc/request';
import { config } from '../config/config';
import {LikePostDTO, LikesScrapDTO, ScrapPostDTO, ScrapQuestionDTO} from '../types/dto/likesscrap.dto';
import { BankerMyPageReturnDTO } from '../types/dto/banker.dto';

const BASE_URL = config.apiUrl;

export const myPageService = {
  // 스크랩한 커뮤니티 게시물 목록 조회
  getScrapedPosts: (customerId: number) => {
    return request<ScrapPostDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/my/post/scrapList/${customerId}`
    });
  },

  // 스크랩한 qna 게시물 목록 조회
  getScrapedQnas: (customerId: number) => {
    return request<ScrapQuestionDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/my/qna/scrapList/${customerId}`
    });
  },

  //좋아요한 게시물 목록 조회
  getLikedPosts: (customerId: number) => {
    return request<LikePostDTO[]>({
        method: 'GET',
        url: `${BASE_URL}/my/post/likeList/${customerId}`
    });
  },
  //질문 등록
  getRegisteredQuestions : (customerId: number) => {
    return request<LikesScrapDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/my/questions/${customerId}`
    })
  },
  //행원 마이페이지 정보보기
  getBankerMyPage: (bankerId:number) => {
    return request<BankerMyPageReturnDTO>({
      method:'GET',
      url: `${BASE_URL}/my/bankers/mypage`,
      params: {
        bankerId: bankerId.toString()
    }
    })
  }
};
