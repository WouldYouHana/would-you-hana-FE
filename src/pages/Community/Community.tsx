import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Divider, List, message, Skeleton } from 'antd';
import { getAuthToken } from '../../hoc/request';
import CommunityNotice from '../../components/board/CommunityNotice/CommunityNotice';
import CommunityCategory from '../../components/board/Category/CommunityCategory';
import IconPencil from '../../assets/img/icon_pencil.svg';
import { communityService } from '../../services/community.service';
import { CommunityListDTO } from '../../types/dto/community.dto';
import { relativeTime } from '../../utils/stringFormat';

const Community: React.FC = () => {
  const userLocation = localStorage.getItem('userLocation');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [communityList, setCommunityList] = useState<CommunityListDTO[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await communityService.getCommunityList(userLocation); // location이 필요한 경우 state로 처리 가능
        setCommunityList(Array.isArray(response.data) ? response.data : []); // 배열 여부 확인
        setHasMore(Array.isArray(response) && response.data.length > 0);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        message.error('게시물을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [navigate]);

  const handlePostClick = useCallback(
    (postId: number) => {
      navigate(`detail/${postId}`);
    },
    [navigate]
  );

  const handleRegisterButton = useCallback(() => {
    const isLoggedIn = getAuthToken();
    if (isLoggedIn === 'null' || !isLoggedIn) {
      message.warning('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('regist');
  }, [navigate]);

  const loadMoreData = useCallback(() => {
    if (loading) return;
    setLoading(true);

    setCommunityList((prevData) => {
      const nextData = communityList.slice(prevData.length, prevData.length + 5);
      if (nextData.length === 0) setHasMore(false);
      return [...prevData, ...nextData];
    });

    setLoading(false);
  }, [loading, communityList]);

  const truncateText = useCallback((text: string, maxLength: number) => {
    return text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }, []);

  // getCommunityByCategory API 함수
  const getCommunityByCategory = useCallback(
    async (category: string, location: string | null) => {
      try {
        setLoading(true);
        const response = await communityService.getCommunityList(location);
        if (category === '전체') {
          setCommunityList(Array.isArray(response.data) ? response.data : []); // 전체 카테고리일 때는 모든 데이터 설정
        } else {
          const filteredData = response.data.filter(
            (post: CommunityListDTO) => post.categoryName === category
          );
          setCommunityList(Array.isArray(filteredData) ? filteredData : []); // 카테고리와 일치하는 데이터만 필터링
        }
        setHasMore(Array.isArray(response) && response.length > 0);
      } catch (error) {
        console.error('Failed to fetch posts by category:', error);
        message.error('게시물을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    // 카테고리나 위치가 변경될 때마다 데이터를 새로 가져옴
    getCommunityByCategory(selectedCategory, userLocation);
  }, [selectedCategory, userLocation, getCommunityByCategory]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category); // 카테고리 변경 시 업데이트
  }, []);

  const renderListItem = useCallback(
    (item: CommunityListDTO) => (
      <List.Item
        key={item.postId}
        className={`w-full h-auto p-0.5 m-0 relative border-b border-[rgba(140,140,140,0.35)]`}
        style={{
          borderBottom: '1px solid rgba(140, 140, 140, 0.35)', // 구분선 스타일 추가
          paddingBottom: '15px',
        }}
        onClick={() => handlePostClick(item.postId)}
      >
        <div className='py-3 px-5 flex'>
            <div className='w-full flex flex-col text-start justify-start gap-2'>
              <p className='text-sm text-gray-500'>{item.categoryName}</p>
              <div className='flex justify-between'>
                <div>
                  <h1 className='text-lg font-bold'>{truncateText(item.title, 23)}</h1>
                  <p>{truncateText(item.content, 180)}</p>
                </div>
                {item.filePaths.length > 0 && (
                  <div className=''>
                    <img
                      src={item.filePaths[0]}
                      className='w-20 h-20 object-cover rounded-md'
                      alt='Post'
                    />
                  </div>
                )}
              </div>

              <div className='flex justify-between mt-3'>
                  <p className='text-sm text-gray-500'>
                    <span className='text-mainColor'>조회 {item.viewCount}</span>
                    {' · '}좋아요 {item.likeCount}
                    {' · '}스크랩 {item.scrapCount}
                    {' · '}댓글 {item.commentCount}
                    {' · '}{item.nickname}
                  </p>
                  <p className='text-sm text-gray-500 pr-5'>
                    <span className='text-gray-500'>
                      {relativeTime(+new Date(item.createdAt))}
                    </span>
                  </p>
              </div>

            </div>
        </div>
      </List.Item>
    ),
    [handlePostClick, truncateText]
  );

  return (
    <div id='scrollableDiv' className='h-auto overflow-auto px-4 mt-5'>
      <InfiniteScroll
        dataLength={communityList.length}
        next={loadMoreData}
        hasMore={hasMore}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>더 이상 게시물이 없습니다.</Divider>}
        scrollableTarget='scrollableDiv'
        className='w-full px-[15%]'
      >
        <CommunityNotice />
        <div className='mt-4 mb-4 flex items-center justify-end'>
          <button
            onClick={handleRegisterButton}
            className='rounded bg-mainColor text-white px-4 py-2.5 flex items-center'
          >
            글쓰기
            <img src={IconPencil} alt='Write' className='w-5 ml-1' />
          </button>
        </div>
        <CommunityCategory setCategory={handleCategoryChange} />
        <List
          grid={{ gutter: 0, column: 1 }}
          dataSource={communityList} // 필터링된 data 사용
          renderItem={renderListItem}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Community;
