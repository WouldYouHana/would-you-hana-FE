import React, { useEffect, useState } from 'react';
import iconClock from '../../assets/img/icon_clock.svg';
import iconHome from '../../assets/img/icon_home.svg';
import iconHana from '../../assets/img/icon_hana.png';
import iconPin from '../../assets/img/icon_pin.svg';
import iconPhone from '../../assets/img/icon_phone.svg';
import hwayangImg from '../../assets/img/bank/hwayang.jpg';
import seongsuImg from '../../assets/img/bank/seongsu.png';
import seouluuuuuupImg from '../../assets/img/bank/seoulsuuuuuup.jpg';
import { reservationService } from '../../services/reservation.service';
import { ReservationResponseDTO } from '../../types/dto/reservation.dto';

const UserReservation: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [reservations, setReservations] = useState<ReservationResponseDTO[]>([]);

  const branchDetails = {
    화양동지점: {
      image: hwayangImg,
      address: '서울시 광진구 화양동 123-45',
      contact: '02-111-2222',
      status: '영업 중',
      url: 'https://place.map.kakao.com/872699546',
    },
    성수역지점: {
      image: seongsuImg,
      address: '서울시 성동구 성수동 678-90',
      contact: '02-333-4444',
      status: '영업 중',
      url: 'https://place.map.kakao.com/1841540654',
    },
    서울숲지점: {
      image: seouluuuuuupImg,
      address: '서울시 성동구 서울숲길 101-23',
      contact: '02-555-6666',
      status: '영업 중',
      url: 'https://place.map.kakao.com/8123840',
    },
  };

  // 예약 내역을 API에서 가져오는 함수
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const customerId = localStorage.getItem('userId');
        const response = await reservationService.getReservations(customerId);
        setReservations(response.data); // API로부터 받은 예약 내역을 상태에 설정
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  const handleBranchSelect = (branchName: string) => {
    setSelectedBranch(branchName);
  };

  const handleDetailInfo = (url: string) => {
    window.open(url, '_blank');
  };
  
  // 선택한 지점의 정보를 찾는 함수
const getBranchDetails = (branchName: string) => {
  return branchDetails[branchName]; // 객체에서 해당 지점의 정보를 직접 가져옵니다.
};

  return (
    <div className='flex'>
      {/* 예약 내역 */}
      <div
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          width: '50%',
        }}
      >
        <div>예약 내역</div>
        <div className='px-10'>
          <div
          className='scroll-container'
            style={{
              marginTop: '20px',
              maxHeight: '75vh',
              overflowY: 'auto',
              justifyItems: 'center',
            }}
          >
            {reservations.map((reservation) => (
              <div
                key={reservation.branchName}
                style={{
                  border: '1px solid #7E8082',
                  borderRadius: '10px',
                  padding: '15px',
                  marginBottom: '15px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  width: '90%',
                  marginRight: '10px',
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 'bolder',
                      color: '#FC4C4E',
                      marginBottom: '3px',
                      fontSize: '15px',
                    }}
                  >
                    {reservation.rdayTime.substring(2, 4)}.{reservation.rdayTime.substring(5, 7)}.{reservation.rdayTime.substring(8, 10)}
                  </p>
                </div>
                <div className='flex ml-4'>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    className='mt-2'
                  >
                    <div
                      style={{
                        backgroundColor: '#E9F2FF',
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <img src={iconHana} width={'17px'} />
                    </div>
                    <div
                      style={{
                        borderLeft: '3px solid #D9D9D9',
                        height: '90%',
                        margin: '5px',
                      }}
                    />
                  </div>
                  <div className='flex flex-col ml-4 mt-1 text-[#555558] gap-2'>
                    <div className='text-black'>
                      <strong>{reservation.branchName}</strong>
                    </div>
                    <div
                      className='flex gap-2 align-center text-center'
                      style={{ fontSize: '16px' }}
                    >
                      <img src={iconClock} width={'17px'} />
                      {reservation.rdayTime.substring(11, 16)} 예약
                      <p
                        className='text-gray-400 font-normal flex justify-center items-center'
                        style={{ fontSize: '14px' }}
                      >
                        {' '}
                        · 1번째 방문
                      </p>
                    </div>
                    <div className='flex gap-2' style={{ fontSize: '16px' }}>
                      <img src={iconHome} width={'17px'} />
                      {reservation.bankerName? reservation.bankerName : '행원 미지정'}
                    </div>
                    <button
                      style={{
                        borderWidth: '1px',
                        borderColor: '#008485',
                        borderRadius: '50px',
                        color: '#008485',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        marginTop: '10px',
                        width: '100px',
                      }}
                      className='px-4 py-3'
                      onClick={() => handleBranchSelect(reservation.branchName)}
                    >
                      지점 정보
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 지점 정보 */}
      <div
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          width: '50%',
          marginLeft: '30px',
        }}
      >
        {selectedBranch ? (
          // 선택한 지점의 정보를 가져와 출력
          (() => {
            const branch = getBranchDetails(selectedBranch);
            return branch ? (
              <div className='flex flex-col gap-2'>
                <p>지점 정보</p>
                <div style={{ marginBottom: '20px' }}>{branch.branchName}</div>
                <img
                  src={branch.image}
                  alt={`${branch.branchName} 이미지`}
                  style={{
                    width: '350px',
                    height: '350px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                  }}
                />
                <div className='flex flex-row gap-3 items-center'>
                  <img src={iconPin} style={{ width: '25px' }} />
                  <p>{branch.address}</p>
                </div>
                <div className='flex flex-row gap-3 items-center'>
                  <img src={iconPhone} style={{ width: '25px' }} />
                  <p>{branch.contact}</p>
                </div>
                <div className='flex flex-row gap-3 items-center'>
                  <img src={iconClock} style={{ width: '25px' }} />
                  <p>09:00 ~ 16:00</p>
                </div>
                <div className='flex flex-row gap-3 items-center'>
                  <img src={iconHome} style={{ width: '25px' }} />
                  <p>{branch.status}</p>
                </div>
                <button
                  style={{
                    borderWidth: '1px',
                    borderColor: '#008485',
                    borderRadius: '50px',
                    color: '#008485',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    marginTop: '10px',
                    width: '350px',
                  }}
                  className='px-4 py-3'
                  onClick={() => handleDetailInfo(branch.url)}
                >
                  상세보기
                </button>
              </div>
            ) : (
              <div>지점 정보를 찾을 수 없습니다.</div>
            );
          })()
        ) : (
          <div>지점을 선택하세요.</div>
        )}
      </div>
    </div>
  );
};

export default UserReservation;