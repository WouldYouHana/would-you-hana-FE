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
    postId : number;
    categoryName : string;
    title : string;
    customerName : string;
    likeCount : number;
    viewCount : number;
    createdAt : string;
    updatedAt : string;
}

export interface LikePostDTO{
    requestId : number;
    postId : number;
    categoryName : string;
    title : string;
    nickname : string;
    likeCount : number;
    viewCount : number;
    createdAt : string;
    updatedAt : string;
}

export interface ScrapQuestionRequestDTO {
    questionId: number;
    customerId: number;
}
export interface ScrapPostRequestDTO {
    postId: number;
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
}

export interface ScrapPostResponseDTO {
    requestId: number;
    postId: number;

    // 화면에 보여지는 내용
    categoryName: string;
    title: string;
    customerName: string;
    likeCount: number;
    viewCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface likePostRequestDTO {
    postId: number;
    customerId: number;
}
