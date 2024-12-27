export interface BankerSignUpDto{
    name:string;
    email:string;
    confirmEmail:string;
    password:string;
    confirmPassword:string;
    location:string;
    branchName:string;
    login:string;
}

export interface SpecializationResponseDTO{
    id:number;
    name:string;
}

export interface BankerListReturnDTO{
    bankerId:number;
    bankerName:number;
    branchName:number;
    content:string;
    specializations:SpecializationResponseDTO[];
}

export interface BankerMyPageReturnDTO{
    name:string;
    branchName:string;
    specializations:string[];
    content:string;
    filePath:string;
    totalGoodCount:number;
    totalCommentCount:number;
    totalViewCount:number;
}

export interface BankerProfileModifyDTO{
    name:string;
    bankerId:number;
    specializations:string[];
    content:string;
    filePath:string;
}