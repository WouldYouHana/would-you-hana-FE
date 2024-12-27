import { request } from '../hoc/request';
import {
  QuestionAddRequestDTO,
  QuestionAllResponseDTO,
  QnaListDTO,
  QuestionResponseDTO,
} from '../types/dto/question.dto';
import { AnswerAddRequestDTO, AnswerGoodRequestDTO, AnswerResponseDTO } from '../types/dto/answer.dto';
import { config } from '../config/config';
import { CommentAddRequestDTO, CommentResponseDTO } from '../types/dto/comment.dto';

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
  getQnaList: (sort: string, location: string|null) => {
    return request<QnaListDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/qna/qnaList/${sort}`,
      params: location ? { location } : {} // location이 null이 아니면 location을 포함한 객체를 만들어 준다.
    });
  },

  // 전체 질문 목록 조회(행원)
  getQnaListBanker: (sort: string, branch: string) => {
    return request<QnaListDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/qna/qnaList/${sort}/branch`,
      params: branch ? { branch } : {} // location이 null이 아니면 location을 포함한 객체를 만들어 준다.
    });
  },

  // 카테고리별 질문 목록 조회
  getQnaListByCategory: (category: string, location: string|null) => {
    return request<QnaListDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/qna/qnaList/${category}`,
      params: location ? { location } : {} // location이 null이 아니면 location을 포함한 객체를 만들어 준다.
    });
  },

  // 인기 질문 목록 조회
  getTodayQuestions: (location: string|null) => {
    return request<QnaListDTO[]>({
      method: 'GET',
      url: `${BASE_URL}/qna/todayQnaList`,
      params: location ? { location } : {} 
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
      url: `${BASE_URL}/qna/${questionId}`
    });
  },

  // 답변 등록
  postAnswer: (questionId: number, data: AnswerAddRequestDTO) => {
    return request<AnswerResponseDTO>({
      method: 'POST',
      url: `${BASE_URL}/qna/answer/${questionId}`,
      data
    });
  },
  // 도움돼요 누르기
  postGood: (data: AnswerGoodRequestDTO) => {
    return request<String>({
      method: 'POST',
      url: `${BASE_URL}/qna/answerLike`,
      data
    });
  },
  // 댓글 달기
  addComment: (questionId: number, data: CommentAddRequestDTO) => {
    return request<CommentResponseDTO>({
      method: 'POST',
      url: `${BASE_URL}/qna/comment/${questionId}`,
      data
    });
  },
  isCheckedGood:(data: AnswerGoodRequestDTO)=>{
    return request<boolean>({
      method:'POST',
      url: `${BASE_URL}/qna/answerLikeCheck`,
      data
    })
  }
}; 
