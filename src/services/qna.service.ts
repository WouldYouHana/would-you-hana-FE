import { request } from '../hoc/request';
import { 
  QuestionAddRequestDTO, 
  QuestionAllResponseDTO,
  QnaListDTO,
  QuestionResponseDTO
} from '../types/dto/question.dto';
import { AnswerAddRequestDTO, AnswerResponseDTO } from '../types/dto/answer.dto';
import { config } from '../config/config';

const BASE_URL = config.apiUrl;

export const qnaService = {
  // 질문 등록
  createQuestion: (data: FormData) => {
    return request<QuestionAllResponseDTO>({
      method: 'POST',
      url: `${BASE_URL}/qna/register`,
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // 질문 수정
  updateQuestion: (questionId: number, data: QuestionAddRequestDTO) => {
    return request<QuestionAllResponseDTO>({
      method: 'POST',
      url: `${BASE_URL}/qna/modify/${questionId}`,
      data,
    });
  },

  // 질문 삭제
  deleteQuestion: (questionId: number) => {
    return request<void>({
      method: 'DELETE',
      url: `${BASE_URL}/qna/delete/${questionId}`
    });
  },

  // 전체 질문 목록 조회
  getQnaList: () => {
    return request<QnaListDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/qnalist`
    });
  },

  // 카테고리별 질문 목록 조회
  getQnaListByCategory: (categoryId: number) => {
    return request<QnaListDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/qnalist/${categoryId}`
    });
  },

  // 내 질문 목록 조회
  getMyQuestions: (customerId: number) => {
    return request<QnaListDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/mypage/questions/${customerId}`
    });
  },

  // 질문 상세 조회
  getQuestionDetail: (questionId: number) => {
    return request<QuestionResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/post/${questionId}`
    });
  },

  // 답변 등록
  postAnswer: (questionId: number, data: AnswerAddRequestDTO) => {
    return request<AnswerResponseDTO>({
      method: 'POST',
      url: `${BASE_URL}/post/answer/${questionId}`,
      data
    });
  }
}; 