import React, { useEffect, useState } from 'react';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import iconClock from '../../assets/img/icon_clock.svg';
import iconHome from '../../assets/img/icon_home.svg';
import iconHana from '../../assets/img/icon_hana.png';
import { ReservationResponseDTO } from '../../types/dto/reservation.dto';
import { reservationService } from '../../services/reservation.service';
import dayjs from 'dayjs';

const BankerReservation: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [reservations, setReservations] = useState<ReservationResponseDTO[]>([]);
  const [filteredReservations, setFilteredReservations] = useState(reservations);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 예약 내역을 API에서 받아오는 함수
  const fetchReservations = async (bankerId: number) => {
    setLoading(true);
    try {
      const response = await reservationService.getReservatoinsForBanker(bankerId);
      setReservations(response.data); // 예약 내역을 상태에 저장
      setLoading(false);
    } catch (error) {
      setError('예약 정보를 불러오는 데 실패했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const bankerId = localStorage.getItem('userId');
    fetchReservations(bankerId);
  }, []);

  const getListData = (value: Dayjs) => {
    const selectedDateString = value.format('YYYY-MM-DD');
    return reservations.filter((reservation) =>
      dayjs(reservation.rdayTime).format('YYYY-MM-DD') === selectedDateString
    );
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    const listData = getListData(date);
    setFilteredReservations(listData);
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.branchName}>
            <Badge status="success" text={`${item.rdayTime.substring(11, 16)}`} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  return (
    <div className="flex">
      {/* 캘린더 */}
      <div style={{ maxWidth:'700px', minWidth:'700px' }}>
        <Calendar
          onSelect={handleDateSelect}
          cellRender={cellRender}
          style={{ height: '100%' }}
        />
      </div>

      {/* 예약 내역 */}
      <div
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          width: '50%',
          marginLeft: '30px',
        }}
      >
        
        <div className="px-10">
        <div style={{paddingLeft:'15px'}}>예약 현황</div>
          <div
          className = "scroll-container"
            style={{
              marginTop: '20px',
              maxHeight: '90vh',
              overflowY: 'auto',
              justifyItems: 'center',
            }}
          >
            {filteredReservations.map((reservation) => (
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
                <div className="flex ml-4">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    className="mt-2"
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
                  <div className="flex flex-col ml-4 mt-1 text-[#555558] gap-2">
                    <div className="text-black">
                      <strong>{reservation.customerName}</strong>
                    </div>
                    <div
                      className="flex gap-2 align-center text-center"
                      style={{ fontSize: '16px' }}
                    >
                      <img src={iconClock} width={'17px'} />
                      {reservation.rdayTime.substring(11, 16)} 예약
                      <p
                        className="text-gray-400 font-normal flex justify-center items-center"
                        style={{ fontSize: '14px' }}
                      >
                        {' '}
                        · 1번째 방문
                      </p>
                    </div>
                    <div className="flex gap-2" style={{ fontSize: '16px' }}>
                      <img src={iconHome} width={'17px'} />
                      {reservation.bankerName? 
                      reservation.bankerName: '행원 미지정'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankerReservation;
