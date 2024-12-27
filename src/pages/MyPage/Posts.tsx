import React, {useEffect, useState} from 'react';
import PostList from '../../components/board/PostList/PostList';
import { useNavigate } from 'react-router-dom';
import icon_logo from '../../assets/img/icon_logo.png';
import {myPageService} from "../../services/mypage.service.ts";
import { LikesScrapDTO } from '../../types/dto/likesscrap.dto.ts';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<LikesScrapDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const postsPerPage = 5;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  //const userEmail = useSelector((state: RootState) => state.auth.userEmail);
  //const posts: Post[] = userEmail ? getPostsByEmail(userEmail) : [];
  // userId == loggedUserId인 post 필터링
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePostClick = (postId: number) => {
    navigate(`/qna/detail/${postId}`); // 특정 포스트 ID로 페이지 이동
  };

  useEffect(() => {
    const fetchPosts = async() => {
      try{
        const customerId = Number(localStorage.getItem('userId'));
        const response = await myPageService.getRegisteredQuestions(customerId);
        setPosts(response.data);
      }catch(error){
        console.error('failed to fetch scraps:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div
        style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}
      >
        게시글
      </div>
      {posts.length ? <PostList
        posts={currentPosts}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        onPageChange={handlePageChange}
        onPostClick={handlePostClick}
      /> :
      <div className='h-20 w-full flex justify-center items-center gap-20 mt-10'>
        작성하신 Q&A 게시글이 없습니다! <br>
        </br>
        지금 게시글을 작성해 보세요.
        <img src={icon_logo} className='w-20 h-22'></img>
      </div>}
      
    </>
  );
};

export default Posts;
