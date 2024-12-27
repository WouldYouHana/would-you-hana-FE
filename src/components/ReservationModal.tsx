import React, { useState, useEffect } from 'react';
import {
  Modal,
  Calendar,
  Button,
  Typography,
  message
} from 'antd';
import Lottie from 'react-lottie';
import checkLottie from '../assets/lottie/check.json';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';

import 'dayjs/locale/zh-cn';
import { ReservationRequestDTO } from '../types/dto/reservation.dto';
import { reservationService } from '../services/reservation.service';

dayjs.extend(dayLocaleData);

interface ReservationModalProps {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  selectedBranchName: string | null;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  selectedBranchName,
}) => {
  const currentDateTime = dayjs();

  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 지점명에서 '하나은행' 또는 '하나은행365'를 제거하는 함수
  const getBranchName = (fullBranchName: string) => {
    return fullBranchName.replace(/하나은행(365)?\s*/, '');
  };

  // 모달이 열릴 때 selectedDate와 selectedTime을 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(currentDateTime.format('YYYY-MM-DD'));
      setSelectedTime(null);
    }
  }, [isOpen]);

  const handleOk = async () => {
    if (!selectedTime) {
      message.warning('예약 시간을 선택해 주세요.');
    } else if (!selectedDate) {
      message.warning('예약 날짜를 선택해 주세요.');
    } else {
      const reservationData: ReservationRequestDTO = {
        customerId: localStorage.getItem('userId'),
        branchName: getBranchName(selectedBranchName),
        reservationDate: `${selectedDate}T${selectedTime}:00`,
        bankerName: localStorage.getItem('문보경'),
      };

      try {
        const result = await reservationService.registReservation(reservationData);
        if (result.data) {
          setShowAnimation(true);
          setTimeout(() => {
            onOk();
            setShowAnimation(false);
          }, 1500);
          message.success('예약이 성공적으로 등록되었습니다.');
        } else {
          throw new Error('예약 등록 실패');
        }
      } catch (error) {
        console.log(error);
        message.error('예약 등록에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const lottieOptions = {
    loop: false,
    autoplay: true,
    animationData: checkLottie,
  };

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const onDateSelect = (date: Dayjs) => {
    // 선택된 날짜를 'YYYY-MM-DD' 형식으로 저장
    setSelectedDate(date.format('YYYY-MM-DD'));
  };

  const times = {
    am: ['09:30', '10:00', '10:30', '11:00', '11:30'],
    pm: [
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',    
    ],
  };

  return (
    <Modal
      title='예약하기'
      open={isOpen}
      onOk={handleOk}
      onCancel={onCancel}
      styles={{ body: { maxHeight: '400px', overflowY: 'auto' } }}
      className='scrollbar-thumb-rounded'
    >
      {showAnimation ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Lottie options={lottieOptions} height={200} width={200} />
          <p style={{ fontSize: '15px' }}>예약이 완료되었습니다.</p>
        </div>
      ) : (
        <>
          <div>
            <p
              style={{ fontSize: '20px', fontWeight: '700', marginTop: '3px' }}
            >
              날짜와 시간을 선택해주세요.
            </p>
            <div style={{ marginTop: '10px' }}>
              <Calendar
                fullscreen={false}
                onSelect={onDateSelect}
                onPanelChange={onPanelChange}
                disabledDate={(current) => current.isBefore(dayjs().startOf('day'), 'day')}
              />
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Typography.Title level={5}>오전</Typography.Title>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '10px',
              }}
            >
              {times.am.map((time) => {
                const timeMoment = dayjs(time, 'HH:mm');
                const isDisabled = timeMoment.isBefore(currentDateTime, 'minute')
                  && selectedDate === currentDateTime.format('YYYY-MM-DD');

                return (
                  <Button
                    key={time}
                    type={selectedTime === time ? 'primary' : 'default'}
                    onClick={() => handleTimeClick(time)}
                    disabled={isDisabled}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>

            <Typography.Title level={5}>오후</Typography.Title>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {times.pm.map((time) => {
                const timeMoment = dayjs(time, 'HH:mm');
                const isDisabled = timeMoment.isBefore(currentDateTime, 'minute')
                  && selectedDate === currentDateTime.format('YYYY-MM-DD');

                return (
                  <Button
                    key={time}
                    type={selectedTime === time ? 'primary' : 'default'}
                    onClick={() => handleTimeClick(time)}
                    disabled={isDisabled}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ReservationModal;
