import { CommentDTO } from "./comment.dto";
import { AnswerResponseDTO } from "./answer.dto";
// Request DTOs
export interface QuestionAddRequestDTO {
    title: string;
    customerId: number;
    categoryName: string;
    location: string;
    content: string;
    file?: File[];
}

// Response DTOs
export interface QnaListDTO {
  questionId: number;
  customerId: number;
  categoryId: number;
  categoryName: string;
  title: string;
  location: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  scrapCount: number;
  viewCount: number;
  answerBanker: string;
}

export interface QuestionAllResponseDTO {
    questionId: number;
    customerId: number;
    categoryId: number;
    title: string;
    content: string;
    location: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    scrapCount: number;
    viewCount: number;
    file: string[];
} 

export interface QuestionResponseDTO {
    questionId: number;
    customerId: number;
    categoryId: number;    
    nickname: string;
    title: string;
    content: string;
    location: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    scrapCount: number;
    viewCount: number;
    filePaths: string[];
    answer: AnswerResponseDTO;
    commentList: CommentDTO[];
}

// 인기 질문 조회
export interface TodayQnaListDTO {
    questionId: number;
    title: string;
    viewCount: number;
}
