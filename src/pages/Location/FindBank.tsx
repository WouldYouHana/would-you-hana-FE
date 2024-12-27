// @ts-nocheck
import React, { useEffect, useState } from 'react';
import markerImg from '../../assets/img/mark.png';
import markerAtmImg from '../../assets/img/mark_atm.png';
import ReservationModal from '../../components/ReservationModal';
import iconLocation from '../../assets/img/icon_location.svg';
import iconLocationWhite from '../../assets/img/icon_location_white.svg';
import hwayangImg from '../../assets/img/bank/hwayang.jpg';
import seongsuImg from '../../assets/img/bank/seongsu.png';
import seouluuuuuupImg from '../../assets/img/bank/seoulsuuuuuup.jpg';
import { config } from '../../config/config';
import iconPin from '../../assets/img/icon_pin.svg';
import iconClock from '../../assets/img/icon_clock.svg';
import iconPhone from '../../assets/img/icon_phone.svg';
import iconHome from '../../assets/img/icon_home.svg';

const FindBank = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [positions, setPositions] = useState([]);
  const [atmPositions, setATMPositions] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [userDistrict, setUserDistrict] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBranches, setShowBranches] = useState(true);
  const [showATMs, setShowATMs] = useState(true);
  const [mapInstance, setMapInstance] = useState(null);
  const [isBranchActive, setIsBranchActive] = useState(false);
  const [isATMActive, setIsATMActive] = useState(false);
  const [isLocationActive, setIsLocationActive] = useState(true);
  const [selectedBranchName, setSelectedBranchName] = useState<string>(''); 

  const showModal = () => {
    setIsModalOpen(true);
    setSelectedBranchName(selectedLocation.title);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getOperatingStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    const openingTime = 9 * 60;
    const closingTime = 16 * 60;

    if (currentTime < openingTime) {
      return '영업 전';
    } else if (currentTime >= openingTime && currentTime < closingTime) {
      return '영업 중';
    } else {
      return '영업 종료';
    }
  };

  const getBranchImage = (branchName) => {
    switch (branchName) {
      case '하나은행 화양동지점':
        return hwayangImg;
      case '하나은행 성수역지점':
        return seongsuImg;
      case '하나은행 서울숲지점':
        return seouluuuuuupImg;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (mapInstance && userLocation) {
      window.kakao.maps.event.addListener(mapInstance, 'center_changed', () => {
        const center = mapInstance.getCenter();
        const isCentered =
          Math.abs(center.getLat() - userLocation.lat) < 0.0001 &&
          Math.abs(center.getLng() - userLocation.lng) < 0.0001;
        setIsLocationActive(isCentered);
      });

      // 사용자 위치를 빨간 점으로 표시
      const userMarkerElement = document.createElement('div');
      userMarkerElement.style.width = '15px';
      userMarkerElement.style.height = '15px';
      userMarkerElement.style.backgroundColor = 'red';
      userMarkerElement.style.border = '2px solid white';
      userMarkerElement.style.borderRadius = '50%';
      userMarkerElement.style.boxShadow = '0px 0px 6px rgba(255, 0, 0, 0.5)';
      userMarkerElement.style.position = 'relative';

      new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        content: userMarkerElement,
        map: mapInstance,
        zIndex: 3,
      });
    }
  }, [mapInstance, userLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLatLng);

          const script = document.createElement('script');
          script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.kakaoJsKey}&libraries=services&autoload=false`;
          document.head.appendChild(script);

          script.onload = () => {
            window.kakao.maps.load(() => {
              const geocoder = new window.kakao.maps.services.Geocoder();
              geocoder.coord2RegionCode(userLatLng.lng, userLatLng.lat, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const districtInfo = result.find((region) => region.region_type === 'H');
                  if (districtInfo) setUserDistrict(districtInfo.address_name);
                }
              });
            });
          };
        },
        (error) => {
          console.error('Error fetching location:', error);
          setUserLocation({ lat: 37.5665, lng: 126.9780 });
        }
      );
    } else {
      setUserLocation({ lat: 37.5665, lng: 126.9780 });
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.kakaoJsKey}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      try {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById('map');
          const mapOption = {
            center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
            level: 5,
          };
          const map = new window.kakao.maps.Map(mapContainer, mapOption);
          setMapInstance(map);

          const places = new window.kakao.maps.services.Places();

          // Branch 검색
          places.keywordSearch(`${userDistrict} 하나은행`, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const locations = result.map((place) => ({
                title: place.place_name,
                lat: place.y,
                lng: place.x,
                latlng: new window.kakao.maps.LatLng(place.y, place.x),
                image: getBranchImage(place.place_name),
                content: `
        <div style="display: flex; flex-direction: column; gap: 10px; color: black;">
          <div style="display: flex; align-items: center;">
            <img src="${iconPin}" alt="주소 아이콘" style="width: 20px; height: 20px; margin-right: 8px;" />
            ${place.road_address_name || place.address_name}
          </div>
          <div style="display: flex; align-items: center;">
            <img src="${iconPhone}" alt="전화번호 아이콘" style="width: 20px; height: 20px; margin-right: 8px;" />
            ${place.phone || '정보 없음'}
          </div>
          <div style="display: flex; align-items: center;">
            <img src="${iconClock}" alt="영업시간 아이콘" style="width: 20px; height: 20px; margin-right: 8px;" />
            09:00 ~ 16:00
          </div>
          <div style="display: flex; align-items: center;">
            <img src="${iconHome}" alt="현재 상태 아이콘" style="width: 20px; height: 20px; margin-right: 8px;" />
            <span style="color: ${getOperatingStatus() === '영업 중' ? 'green' : 'red'}">${getOperatingStatus()}</span>
          </div>
          <a href="${place.place_url}" target="_blank" style="display: inline-block; width: fit-content; margin-top: 5px; padding: 8px 12px; text-decoration: none; color: white; background-color: #008485; border-radius: 5px; font-weight: bold;">상세보기</a>
        </div>
      `,
      type: 'branch',
              }));
              setPositions(locations);

              locations.forEach((location) => {
                const markerImage = new window.kakao.maps.MarkerImage(
                  markerImg,
                  new window.kakao.maps.Size(30, 35)
                );
                const marker = new window.kakao.maps.Marker({
                  map: showBranches ? map : null,
                  position: location.latlng,
                  title: location.title,
                  image: markerImage,
                  zIndex: 2,
                });

                window.kakao.maps.event.addListener(marker, 'click', () => {
                  setSelectedLocation(location);
                  map.panTo(location.latlng);
                });

                location.marker = marker;
              });
            } else {
              console.error('No Hana Bank branches found.');
            }
          });

          // ATM 검색
          places.keywordSearch(`${userDistrict} 하나은행 ATM`, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const atmLocations = result.map((place) => ({
                title: place.place_name,
                lat: place.y,
                lng: place.x,
                latlng: new window.kakao.maps.LatLng(place.y, place.x),
                content: `
                  주소: ${place.road_address_name || place.address_name}<br/>
                  <a href="${place.place_url}" target="_blank" style="display: inline-block; margin-top: 5px; padding: 8px 12px; text-decoration: none; color: white; background-color: #008485; border-radius: 5px; font-weight: bold;">상세보기</a><br/>
                `,
                type: 'atm',
              }));
              setATMPositions(atmLocations);

              atmLocations.forEach((location) => {
                const markerImage = new window.kakao.maps.MarkerImage(
                  markerAtmImg,
                  new window.kakao.maps.Size(30, 35)
                );
                const marker = new window.kakao.maps.Marker({
                  map: showATMs ? map : null,
                  position: location.latlng,
                  title: location.title,
                  image: markerImage,
                  zIndex: 1,
                });

                window.kakao.maps.event.addListener(marker, 'click', () => {
                  setSelectedLocation(location);
                  map.panTo(location.latlng);
                });

                location.marker = marker;
              });
            } else {
              console.error('No Hana Bank ATMs found.');
            }
          });
        });
      } catch (error) {
        console.error('Error loading the Kakao Maps script:', error);
      }
    };

    script.onerror = () => {
      console.error('Failed to load Kakao Maps SDK');
    };
  }, [userLocation, userDistrict]);

  const toggleBranchMarkers = () => {
    setShowBranches((prev) => !prev);
    setIsBranchActive((prev) => !prev);
    positions.forEach((location) => {
      location.marker.setMap(showBranches ? null : mapInstance);
    });
  };

  const toggleATMMarkers = () => {
    setShowATMs((prev) => !prev);
    setIsATMActive((prev) => !prev);
    atmPositions.forEach((location) => {
      location.marker.setMap(showATMs ? null : mapInstance);
    });
  };

  const goToUserLocation = () => {
    if (mapInstance && userLocation) {
      mapInstance.panTo(new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng));
      setIsLocationActive(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-auto py-[5%]">
  {/* Map Container */}
  <div
    className="relative w-1/2 h-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105"
    id="map"
  >
    <div className="absolute bottom-6 right-6 z-50 flex flex-col space-y-4">
      {/* ATM Button */}
      <button
        onClick={toggleATMMarkers}
        className={`w-12 h-12 text-sm rounded-full transition-all transform hover:scale-110 shadow-lg ${
          isATMActive
            ? "bg-white text-mainColor"
            : "bg-mainColor text-white"
        }`}
      >
        ATM
      </button>

      {/* Branch Button */}
      <button
        onClick={toggleBranchMarkers}
        className={`w-12 h-12 text-sm rounded-full transition-all transform hover:scale-110 shadow-lg ${
          isBranchActive
            ? "bg-white text-mainColor"
            : "bg-mainColor text-white"
        }`}
      >
        영업점
      </button>

      {/* Location Button */}
      <button
        onClick={goToUserLocation}
        className={`w-12 h-12 text-sm rounded-full transition-all transform hover:scale-110 shadow-lg flex items-center justify-center ${
          isLocationActive
            ? "bg-mainColor text-white"
            : "bg-white text-mainColor"
        }`}
      >
        <img
          src={isLocationActive ? iconLocationWhite : iconLocation}
          alt="Location Icon"
          className="w-6 h-6"
        />
      </button>
    </div>
  </div>

  {/* Info Panel */}
  <div className="ml-10 w-80 h-[500px] bg-white rounded-3xl shadow-2xl transform transition-transform flex flex-col overflow-hidden">
    {/* Header */}
    <div className="bg-mainColor p-4 text-center">
      <h3 className="font-bold text-white tracking-wide">
        {selectedLocation ? selectedLocation.title : "상세 정보"}
      </h3>
    </div>

    {/* Scrollable Content */}
    <div className="scroll-container flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100">
      {selectedLocation ? (
        <>
          {selectedLocation.image && (
            <img
              src={selectedLocation.image}
              alt={selectedLocation.title}
              className="w-full h-auto rounded-2xl mb-4 shadow-lg"
            />
          )}
          <div
            className="mt-4 text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedLocation.content }}
          />
        </>
      ) : (
        <p className="text-gray-400 text-center mt-20 animate-fade">
          마커를 클릭하면 <br /> 여기에 상세 정보가 표시됩니다.
        </p>
      )}
    </div>

    {/* Footer */}
    <div className="p-4 text-center  bg-gradient-to-b from-gray-50 to-gray-100">
      {selectedLocation && selectedLocation.type === "branch" && (
        <button
          className="w-full py-3 bg-white text-mainColor font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          onClick={showModal}
        >
          예약하기
        </button>
      )}
    </div>
  </div>

  <ReservationModal isOpen={isModalOpen} onOk={handleOk} onCancel={handleCancel} selectedBranchName={selectedBranchName} />
</div>

  
  );
};

export default FindBank;
