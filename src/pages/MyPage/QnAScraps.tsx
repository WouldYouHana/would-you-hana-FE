import React, { useEffect, useState } from 'react';
import PostList from '../../components/board/PostList/PostList';
import { useNavigate } from 'react-router-dom';
import { myPageService } from '../../services/mypage.service';
import { ScrapQuestionDTO } from '../../types/dto/likesscrap.dto';

const QnAScraps: React.FC = () => {
  const [posts, setPosts] = useState<ScrapQuestionDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const postsPerPage = 5;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePostClick = (postId: number) => {
    navigate(`/qna/detail/${postId}`); // 특정 포스트 ID로 페이지 이동
  };

  useEffect(() => {
    const fetchScraps = async() => {
      try{
        const customerId = Number(localStorage.getItem('userId'));
        const response = await myPageService.getScrapedQnas(customerId);
        setPosts(response.data);
      }catch(error){
        console.error('failed to fetch scraps:', error);
      }
    };

    fetchScraps();
  }, []);

  return (
    <>
      <div
        style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}
      >
        QnA 스크랩
      </div>

      <PostList
        posts={currentPosts}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        onPageChange={handlePageChange}
        onPostClick={handlePostClick}
      />
    </>
  );
};

export default QnAScraps;
