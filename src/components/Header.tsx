import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message, Select, Button, Drawer } from 'antd';
import { MenuOutlined } from "@ant-design/icons";
import type { SelectProps } from 'antd';

import { RootState } from '../hoc/store';
import { logout, updateLocation, updateLocationWithApi } from '../hoc/actions';
import { locations } from '../constants/locations';

// Assets
import logo from '../assets/img/logo.png';
import userIcon from '../assets/img/icon_user.png';
import locationIcon from '../assets/img/icon_location.svg';
import { config } from '../config/config';
// Kakao Maps API 스크립트를 로드하는 함수
const loadKakaoMapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('kakao-map-script')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'kakao-map-script';
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.kakaoJsKey}&libraries=services&autoload=false`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Kakao Maps API 스크립트를 로드하지 못했습니다.'));
    document.head.appendChild(script);
  });
};

// 지역 선택 검색창 컴포넌트 Props
interface SearchInputProps {
  placeholder: string;
  style: React.CSSProperties;
  value: string;
  onChange: (newValue: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, style, value, onChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [data, setData] = useState<SelectProps['options']>([]);
  const { isAuthenticated, interestLocations = ['성동구'] } = useSelector((state: RootState) => state.auth);

  // 관심 지역 초기화
  useEffect(() => {
    if (isAuthenticated) {
      setData(interestLocations.map((loc: string) => ({ text: loc, value: loc })));
    } else {
      setData(locations.map((loc: string) => ({ text: loc, value: loc })));
    }
  }, [isAuthenticated, interestLocations]);

  // 검색 처리
  const handleSearch = useCallback((value: string) => {
    const searchLocations = isAuthenticated ? interestLocations : locations;
    const filteredData = searchLocations
      .map(loc => ({ text: loc, value: loc }))
      .filter(item => item.text.toLowerCase().includes(value.toLowerCase()));
    setData(filteredData);
  }, [isAuthenticated, interestLocations]);

  // 지역 선택 시 페이지 이동
  const handleChange = useCallback((selectedDistrict: string) => {
    onChange(selectedDistrict);
    localStorage.setItem('userLocation', selectedDistrict);
    dispatch(updateLocationWithApi(selectedDistrict));
    navigate(`/district/${selectedDistrict}`);
  }, [navigate, onChange, dispatch]);

  // 현재 위치 가져오기
  const handleGetCurrentLocation = useCallback(async () => {
    try {
      await loadKakaoMapScript();

      if (!navigator.geolocation) {
        throw new Error('Geolocation이 지원되지 않습니다.');
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;

          window.kakao.maps.load(() => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            const coord = new window.kakao.maps.LatLng(latitude, longitude);

            geocoder.coord2Address(coord.getLng(), coord.getLat(), (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK && result[0]) {
                const district = result[0].address?.address_name.split(' ')[1];
                if (district) {
                  onChange(district);
                  navigate(`/district/${district}`);
                }
              }
            });
          });
        },
        error => {
          console.error('위치 정보 가져오기 실패:', error);
          message.error('위치 정보를 가져올 수 없습니다.');
        }
      );
    } catch (error) {
      console.error('위치 서비스 오류:', error);
      message.error('위치 서비스를 사용할 수 없습니다.');
    }
  }, [navigate, onChange]);

  return (
    <div className='flex gap-3 items-center'>
      <Select
        showSearch
        value={value || null}
        placeholder={placeholder}
        style={style}
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        options={data?.map((d) => ({
          value: d.value,
          label: d.text,
        }))}
      />
      {/* 현위치 받아오기 */}
      <button onClick={handleGetCurrentLocation}>
        <img src={locationIcon} width={'20px'} />
      </button>
    </div>
  );
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  const { 
    isAuthenticated, 
    userRole, 
    nickname,
    userLocation 
  } = useSelector((state: RootState) => state.auth);

  // 로그아웃 처리
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
    setDrawerVisible(false);
    message.success('로그아웃 성공!');
  }, [dispatch, navigate]);

  // 검색값 변경 처리
  const handleLocationChange = useCallback((newLocation: string) => {
    dispatch(updateLocation(newLocation));
  }, [dispatch]);

  return (
    <header className="w-screen px-6 py-3 bg-white border-b bold-header">
      <div className="flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="logo" className="w-32" />
        </Link>

        {/* 햄버거 메뉴 버튼 */}
        <Button
          type="text"
          className="lg:hidden"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
        />

        {/* 큰 화면 네비게이션 */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex gap-8">
          {userRole == 'B' ? (
              <li>
                <Link to='/qna/waiting'>대기중인 질문</Link>
              </li>
            )
            :(
              <>
              <li>
                <Link to='/qna'>Q&A</Link>
              </li>
              <li>
                <Link to='/community'>커뮤니티</Link>
              </li>
              <li>
                <Link to={`/district/${userLocation}`}>우주하나</Link>
              </li>
              <li>
                <Link to='/findbank'>영업점 찾기</Link>
              </li>
            </>)
          }
          </ul>
        </nav>

        {/* 큰 화면 검색 및 로그인/로그아웃 */}
        <div className="hidden lg:flex ml-auto items-center gap-6">
          {userRole !== 'B' && (
            <SearchInput
              placeholder="지역을 입력하세요"
              style={{ width: 200 }}
              value={userLocation || ''}
              onChange={handleLocationChange}
            />
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <span className="cursor-pointer" onClick={handleLogout}>
                로그아웃
              </span>
              <Link to="/my/profile" className="flex items-center gap-2">
                <img src={userIcon} alt="user icon" width={35} />
                {nickname && (<span>{nickname}</span>)} 
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/register">회원가입</Link>
              <Link to="/login">로그인</Link>
            </div>
          )}
        </div>
      </div>

      {/* Drawer for 햄버거 메뉴 */}
      <Drawer
        title="메뉴"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <nav className="flex flex-col gap-4">
        {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <Link to="/my/profile" className="flex items-center gap-2" onClick={() => setDrawerVisible(false)}>
                <img src={userIcon} alt="user icon" width={35} />
                {nickname && (<span>{nickname}</span>)} 
              </Link>
              <span className="cursor-pointer" onClick={handleLogout}>
                로그아웃
              </span>
            </div>
          ):(
            <>
            <Link to="/register" onClick={() => setDrawerVisible(false)}>회원가입</Link>
            <Link to="/login" onClick={() => setDrawerVisible(false)}>로그인</Link>
            </>
          )}

          <hr></hr>
          {userRole == 'B' ? (
            <Link to='/qna/waiting' onClick={() => setDrawerVisible(false)}>
              대기중인 질문
            </Link>
          ):(
            <>
               <Link to="/qna" onClick={() => setDrawerVisible(false)}>
                Q&A
              </Link>
              <Link to="/community" onClick={() => setDrawerVisible(false)}>
                커뮤니티
              </Link>
              <Link to={`/district/${userLocation}`} onClick={() => setDrawerVisible(false)}>
              우주하나
              </Link>
              <Link to="/findbank" onClick={() => setDrawerVisible(false)}>
                영업점 찾기
              </Link>
            </>
          )}
        </nav>
      </Drawer>
    </header>
  );
};

export default Header;
