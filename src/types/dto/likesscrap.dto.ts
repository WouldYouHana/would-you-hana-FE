export interface LikesScrapDTO{
    requestId : number;
    questionId : number;
    categoryName : string;
    title : string;
    likeCount : number;
    viewCount : number;
    createdAt : string;
    answerBanker : string;
}

<<<<<<< HEAD
export interface ScrapQuestionDTO{
    requestId : number;
    questionId : number;
    categoryName : string;
    title : string;
    likeCount : number;
    viewCount : number;
    createdAt : string;
    answerBanker : string;
}

export interface ScrapPostDTO{
    requestId : number;
    questionId : number;
    categoryName : string;
    title : string;
    customerName : string;
    likeCount : number;
    viewCount : number;
    createdAt : string;
    updatedAt : string;
=======
export interface ScrapQuestionRequestDTO {
    questionId: number;
    customerId: number;
}

export interface ScrapQuestionResponseDTO {
    requestId: number;
    questionId: number;

    // 화면에 보여지는 내용
    categoryName: string;
    questionTitle: string;
    customerName: string;
    likeCount: number;
    viewCount: number;
    createdAt: string;
    bankerName: string;
>>>>>>> eeca7712ae644034c4fc72c3ff4c6d5187068fb1
}