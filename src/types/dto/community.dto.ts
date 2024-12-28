import { CommentDTO } from "./comment.dto";

export interface CommunityListDTO{
    postId : number;
    nickname : string;
    categoryName : string;
    title : string;
    content : string;
    location : string;
    createdAt : string;
    commentCount : number;
    likeCount : number;
    scrapCount : number;
    viewCount : number;
    filePaths : string[];
}

export interface CommunityResponseDTO{
    postId : number;
    customerId : number;
    nickname : string;
    location : string;
    categoryName : string;
    title : string;
    content : string;
    createdAt : string;
    updatedAt : string;
    likeCount : number;
    scrapCount : number;
    viewCount : number;
    commentList : CommentDTO[];
    filePaths : string[];
}

export interface CommunityAllResponseDTO {
    postId: number;
    customerId: number;
    categoryId : number;
    // categoryName: string;
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

export interface CommunityRegisterDTO{
    title : string;
    customerId : number;
    categoryName : string;
    location : string
    content : string;
}