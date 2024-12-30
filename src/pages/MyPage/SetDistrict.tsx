import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import seoulDistricts from '../../assets/location/seoul_districts.json';
import { userService } from '../../services/user.service';
import { RootState } from '../../hoc/store';
import { setInterestLocations, updateLocationWithApi } from '../../hoc/actions';
import { config } from '../../config/config';

const SetDistrict: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { userId, interestLocations, userLocation } = useSelector((state: RootState) => state.auth);
  
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [inputDistrict, setInputDistrict] = useState('');
  const [polygon, setPolygon] = useState<any>(null);
  const [searchedDistrict, setSearchedDistrict] = useState<string | null>(null);

  // 카카오맵 초기화
  useEffect(() => {
    const initializeMap = async () => {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.kakaoJsKey}&libraries=services&autoload=false`;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById('map');
          const mapOption = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780),
            level: 7,
          };
          setMapInstance(new window.kakao.maps.Map(mapContainer, mapOption));
        });
      };
    };

    initializeMap();
  }, []);

  // 사용자 관심지역 조회
  const fetchInterestLocations = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await userService.getInterestLocationList(userId);
      if (response?.data) {
        dispatch(setInterestLocations(response.data));
      }
    } catch (error) {
      console.error('Failed to fetch interest locations:', error);
      message.error('관심 지역 정보를 불러오는데 실패했습니다.');
    }
  }, [userId, dispatch]);

  // useEffect(() => {
  //   fetchInterestLocations();
  // }, [fetchInterestLocations]);

  // 지역구 검색
  const searchDistrict = useCallback(() => {
    const district = seoulDistricts.features.find(
      (d) => d.properties.SIG_KOR_NM === inputDistrict.trim()
    );

    if (!district) {
      message.warning('지역을 찾을 수 없습니다.');
      return;
    }

    setSearchedDistrict(district.properties.SIG_KOR_NM);

    const coordinates = district.geometry.coordinates[0].map(
      (coord) => new window.kakao.maps.LatLng(coord[1], coord[0])
    );

    // 중심점 계산 및 지도 이동
    const center = coordinates.reduce((acc, curr) => ({
      getLat: () => (acc.getLat() + curr.getLat()) / 2,
      getLng: () => (acc.getLng() + curr.getLng()) / 2
    }));
    
    mapInstance.setCenter(new window.kakao.maps.LatLng(center.getLat(), center.getLng()));

    // 폴리곤 그리기
    if (polygon) polygon.setMap(null);
    const newPolygon = new window.kakao.maps.Polygon({
      path: coordinates,
      strokeWeight: 2,
      strokeColor: '#498DF7',
      strokeOpacity: 0.8,
      fillColor: '#498DF7',
      fillOpacity: 0.4
    });
    
    newPolygon.setMap(mapInstance);
    setPolygon(newPolygon);
  }, [inputDistrict, mapInstance, polygon]);

  // 지역구 추가
  const addDistrict = useCallback(async () => {
    if (interestLocations.length >= 3) {
      message.warning('최대 3개의 지역구만 추가할 수 있습니다.');
      return;
    }

    if (!searchedDistrict || !userId) {
      message.warning('먼저 검색 후 추가하세요.');
      return;
    }

    try {
      await userService.addSpecificInterestLocation({
        customerId: userId,
        location: searchedDistrict
      });
      await fetchInterestLocations(); // 관심 지역 목록 새로고침
      setSearchedDistrict(null);
      message.success('관심 지역이 추가되었습니다.');
    } catch (error) {
      message.error('지역 추가에 실패했습니다.');
    }
  }, [searchedDistrict, interestLocations.length, userId, fetchInterestLocations]);

  // 지역구 삭제
  const removeDistrict = useCallback(async (districtName: string) => {
    if (interestLocations.length <= 1) {
      message.warning('최소 하나의 관심지역은 필요합니다.');
      return;
    }

    if (!userId) return;

    try {
      await userService.deleteSpecificInterestLocation({
        customerId: userId,
        location: districtName
      });
      await fetchInterestLocations(); // 관심 지역 목록 새로고침

      // 현재 지역이 삭제되는 경우, 첫 번째 관심 지역으로 설정
      if (districtName === userLocation) {
        const remainingLocations = interestLocations.filter(loc => loc !== districtName);
        if (remainingLocations.length > 0) {
          dispatch(updateLocationWithApi(remainingLocations[0]));
          message.info(`현재 지역이 ${remainingLocations[0]}로 변경되었습니다.`);
          localStorage.setItem('userLocation', remainingLocations[0]);
        }
      }

      message.success('관심 지역이 삭제되었습니다.');
    } catch (error) {
      message.error('관심 지역 삭제에 실패했습니다.');
    }
  }, [interestLocations, userId, fetchInterestLocations, userLocation, dispatch]);

  // 지역 선택 처리
  const handleSelectLocation = useCallback((location: string) => {
    dispatch(updateLocationWithApi(location));
    message.success(`${location}이(가) 현재 지역으로 설정되었습니다.`);
    localStorage.setItem('userLocation', location);
  }, [dispatch]);



  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold">관심 지역 설정</h2>
      
      <div className="flex justify-center items-start gap-5">
        {/* 지도 영역 */}
        <div className="w-1/2 h-[500px] rounded-lg overflow-hidden shadow-md border border-gray-100" id="map" />

        {/* 검색 및 선택 영역 */}
        <div className="w-[35%] space-y-5">
          {/* 검색 영역 */}
          <h3 className="text-lg font-bold">관심 지역 검색</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputDistrict}
              onChange={(e) => setInputDistrict(e.target.value)}
              placeholder="지역구를 입력하세요"
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={searchDistrict}
              className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainDark"
            >
              검색
            </button>
            <button
              onClick={addDistrict}
              className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainDark"
            >
              추가
            </button>
          </div>

          {/* 선택된 지역 목록 */}
          <h3 className="text-lg font-bold">선택된 지역</h3>
          <div className="space-y-2">
            {interestLocations.map((district, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 ${
                  district === userLocation 
                    ? 'bg-mainColor' 
                    : 'bg-mainColor bg-opacity-65'
                } text-white rounded-lg cursor-pointer hover:bg-mainColor transition-colors`}
                onClick={() => handleSelectLocation(district)}
              >
                <div className="flex items-center gap-2">
                  <span>{district}</span>
                  {district === userLocation && (
                    <span className="text-xs bg-white text-mainColor px-2 py-0.5 rounded-full">
                      현재 지역
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDistrict(district);
                  }}
                  className="text-xl font-bold hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600">
            관심 지역은 최대 3개까지 등록 가능합니다.<br />
            클릭하여 현재 지역으로 설정할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetDistrict;
