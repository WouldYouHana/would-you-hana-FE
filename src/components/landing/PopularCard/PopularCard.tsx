import React from 'react';
import { Card, message } from 'antd';
import { QnaListDTO } from '../../../types/dto/question.dto';
import { CommunityListDTO } from '../../../types/dto/community.dto';
import { relativeTime } from '../../../utils/stringFormat';

const CardContent: React.FC<QnaListDTO|CommunityListDTO> = (post) => (
  <div className="text-left p-3">
    <div className="justify-between">
      <span className="font-bold text-[#FF6F61] text-xs">{post.categoryName}</span>
      <span className="text-gray-500 ml-5 text-xs">{relativeTime(+new Date(post.createdAt))}</span>
    </div>
    <div className="text-black mt-3 text-[15px]">{post.title}</div>
    <div className="mt-3 justify-between text-right">
      <span className="text-gray-500 mr-5 text-xs">좋아요 {post.likeCount|0}</span>
      <span className="text-gray-500 text-xs">조회수 {post.viewCount|0}</span>
    </div>
  </div>
);

interface PopularCardProps {
  title: string;
  contents: QnaListDTO[]|CommunityListDTO[];
}

const PopularCard: React.FC<PopularCardProps> = ({ title, contents }) => {
  if(!contents){
    message.error("작성된 Qna가 없습니다!")
    return;
  }
  return (
    <Card
      title={<span className="font-bold">{title}</span>}
      className="text-center min-h-[450px]"
    >
      <ul className='divide-y divide-gray-100'>
      {contents.map((content, index) => (
        <CardContent key={index} {...content} />
      ))}
      </ul>
      {contents.length < 3 && (
        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-5 mb-3">
          <p className=" text-lg">
          📝 새로운 글을 작성해보세요!
          </p>
        </div>
      )}
     
    </Card>
  );
};

export default PopularCard; 