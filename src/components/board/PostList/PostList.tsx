import React from 'react';
import { Pagination } from 'antd';
import iconUser from '../../../assets/img/icon_user_board.jpg';
import { relativeTime } from '../../../utils/stringFormat';
import { QnaListDTO } from '../../../types/dto/question.dto';
import { ScrapPostDTO, ScrapQuestionDTO } from '../../../types/dto/likesscrap.dto';

interface PostListProps {
  posts: (QnaListDTO | ScrapPostDTO | ScrapQuestionDTO)[];
  currentPage: number;
  postsPerPage: number;
  totalPosts: number;
  onPageChange: (page: number) => void;
  onPostClick: (postId: number) => void;
}

// 타입 가드 함수
const isScrapPostDTO = (post: QnaListDTO | ScrapPostDTO | ScrapQuestionDTO): post is ScrapPostDTO => {
  return (post as ScrapPostDTO).postId !== undefined; // QnaListDTO에만 존재하는 속성으로 확인
};
const isQnaListDTO = (post: QnaListDTO | ScrapPostDTO | ScrapQuestionDTO): post is QnaListDTO => {
  return (post as QnaListDTO).answerBanker !== undefined; // QnaListDTO에만 존재하는 속성으로 확인
};

const PostList: React.FC<PostListProps> = ({
  posts,
  currentPage,
  postsPerPage,
  totalPosts,
  onPageChange,
  onPostClick,
}) => {
  return (
    <>
      <ul className="divide-y divide-gray-300">
        {posts.map((post, index) => (
          <li
            key={index}
            className="py-5 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onPostClick(isScrapPostDTO(post)?post.postId:post.questionId)}
          >
            <div className="text-start">
              {/* 카테고리 */}
              <p className="text-gray-500 mb-2 text-[15px]">
                {post.categoryName}
              </p>
              {/* 제목 */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {post.title}
              </h3>
              {/* 정보 */}
              <p className="text-gray-500 mb-4 text-sm">
                <span className="text-mainColor">
                  조회 {post.viewCount}
                </span>
                <span className="mx-1">·</span>
                <span>도움돼요 {post.likeCount}</span>
                <span className="mx-1">·</span>
                {isQnaListDTO(post) && (
                  <>
                    <span>댓글 {post.commentCount}</span>
                    <span className="mx-1">·</span>
                  </> 
                )}
                <span>{relativeTime(+new Date(post.createdAt))}</span>
              </p>
              {/* 행원 이름 */}
              <div className="flex items-center">
                {isQnaListDTO(post) && post.answerBanker && post.answerBanker !== '답변 대기중' ? (
                  <>
                    <img
                      src={iconUser}
                      alt="User Avatar"
                      className="w-[25px] h-[25px] rounded-full"
                    />
                    <span className="ml-2 text-hoverColor font-extrabold">
                      {post.answerBanker}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500 text-[13px]">답변 대기중</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <footer className="mt-6 flex justify-center">
        <Pagination
          current={currentPage}
          total={totalPosts}
          pageSize={postsPerPage}
          onChange={onPageChange}
        />
      </footer>
    </>
  );
};

export default PostList; 