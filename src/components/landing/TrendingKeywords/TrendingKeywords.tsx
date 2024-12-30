import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Carousel, message } from 'antd';
import { config } from '../../../config/config';
import { districtService } from '../../../services/district.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../../hoc/store';

interface TrendingKeywordsProps {
  carouselIndex: number;
  onCarouselChange: (current: number) => void;
  districtName: string;
}

const TrendingKeywords: React.FC<TrendingKeywordsProps> = ({
  carouselIndex,
  onCarouselChange,
  districtName
}) => {
  const [keywords, setKeywords] = useState<{keyword: string}[]>([]); // 초기 값을 빈 배열로 설정
  // const BASE_URL = config.aiURL;

  const {userLocation} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        if(!userLocation) {
          message.error('위치를 선택해주세요.');
          return;
        }
        // const userLocation = localStorage.getItem('userLocation');
        const response = await districtService.getHotKeywords(userLocation);
    // const response = await axios.get(`${BASE_URL}/hot_keywords`);
        console.log('Fetched keywords:', response.data);  // 키워드 확인용 로그
        setKeywords(response.data || []); // 응답이 없거나 형식이 맞지 않으면 빈 배열 설정
      } catch (error) {
        console.error('Error fetching keywords:', error);
        message.error('키워드 추출 실패');
      }
    };
    
    fetchKeywords();  // 컴포넌트가 처음 렌더링될 때 데이터 요청
  }, [userLocation]);  // 빈 배열을 전달하여 한 번만 실행되도록 설정

  return (
    <div className="flex flex-col justify-center  mr-[150px] mt-0">
      <span className="text-4xl font-extrabold self-start">
        지금 <span className="text-5xl font-extrabold">{districtName}</span> 주민들은
      </span>
      <div className="flex items-center justify-center mt-1 mb-1">
      <style>
              {`
                .custom-carousel .carousel-item {
                    transition: all 0.3s ease;
                    text-align: center;
                    font-size: 50px;
                    opacity: 0.5;
                    transform: scale(0.8);
                    cursor: pointer;
                    height: 100px;
                    line-height: 100px;
                    color: #008485;
                }

                .custom-carousel .carousel-item.focused {
                    font-size: 60px;
                    font-weight: 800;
                    opacity: 1;
                    transform: scale(1);
                }

                .custom-carousel {
                    max-height: 300px;
                    overflow: hidden;
                }
                `}
            </style>
        <Carousel
          afterChange={onCarouselChange}
          vertical
          dots={false}
          className="custom-carousel w-[500px]"
          autoplay
          autoplaySpeed={2800}
        >
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className={`carousel-item ${
                index === carouselIndex ? 'focused' : ''
              }`}
            >
              {keyword.keyword}
            </span>
          ))}
        </Carousel>
      </div>
      <p className="text-4xl font-extrabold self-end">
          에 관심이 있어요.
        </p>
    </div>
  );
};

export default TrendingKeywords; 