import { config } from "../config/config";
import { request } from "../hoc/request";
import {
    likePostRequestDTO,
    ScrapPostRequestDTO,
    ScrapQuestionRequestDTO,
    ScrapQuestionResponseDTO
} from "../types/dto/likesscrap.dto";

const BASE_URL = config.apiUrl;

export const likesscrapService = {
    // 질문 스크랩
    scrapQuestion: (data: ScrapQuestionRequestDTO) => {
        return request<String>({
            method: 'POST',
            url: `${BASE_URL}/qna/scrap`,
            data
        });
    },
    // 스크랩한 qna 조회
    getScrapedQna: (customerId: number) => {
        return request<ScrapQuestionResponseDTO[]>({
            method: 'GET',
            url: `${BASE_URL}/my/qna/scrapList/${customerId}`
        });
    },
    // 커뮤니티 게시글 스크랩 요청 (저장, 취소)
    scrapPostRequest: (data: ScrapPostRequestDTO) => {
        return request<String>({
            method: 'POST',
            url: `${BASE_URL}/post/scrap`,
            data
        });
    },
    getIsQuestionScrapChecked: (customerId: number, questionId: number) => {
        return request<boolean>({
            method: 'GET',
            url: `${BASE_URL}/my/qna/scrap/${customerId}/${questionId}`,
        })
    },
    getIsPostScrapChecked: (customerId: number, postId: number) => {
        return request<boolean>({
            method: 'GET',
            url: `${BASE_URL}/my/post/scrap/${customerId}/${postId}`,
        })
    },
    likePostRequest: (data: likePostRequestDTO) => {
        return request<number>({
            method: 'POST',
            url: `${BASE_URL}/post/dolike`,
            data
        })
    }
}