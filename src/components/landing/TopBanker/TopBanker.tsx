import React from 'react';
import { Card } from 'antd';
import iconUser from '../../../assets/img/icon_user.png';
import { CustomerResponseDTO } from '../../../types/dto/customer.dto';

const TopBanker: React.FC<{ topUsers: CustomerResponseDTO[] }> = ({ topUsers }) => {
  const bgColors = ['bg-[#ffC0CB60]', "bg-[#f6FE8060]", "bg-[#ADC8E650]"];

  return (
    <Card
      title={<span className="font-bold">🏆 오늘의 열혈 활동가</span>}
      className="text-center min-h-[450px]"
    >
      {topUsers.map((user, index) => (
        <div
          key={index}
          className={`flex items-center ${bgColors[index]} rounded-lg p-5 mb-3 text-left`}
        >
          <span className="text-4xl mr-4 leading-none">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
          {index === 0 ? (
            <div className='flex'>
              <img
                src={iconUser}
                alt="User Icon"
                className="w-[100px] h-[100px] mr-4"
              />
              <div className='flex flex-col justify-center'>
                <p className="font-bold text-lg mb-2">{user.nickname}</p>
                <p className="">댓글수 {user.todayCommentCount | 0}</p>
                <p className="">작성글수 {user.QnaPostCount | 0}</p>
              </div>
            </div>
          ) : (
            <div>
              <span className="font-bold text-[15px] mr-5">{user.nickname}</span>
              <span className="mr-3">댓글수 {user.todayCommentCount | 0}</span>
              <span className="">작성글수 {user.QnaPostCount | 0}</span>
            </div>
          )}
        </div>
      ))}
      {topUsers.length < 3 && (
        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-5 mb-3">
          <p className=" text-lg">
            ✨ 열혈 활동가에 도전해보세요!
          </p>
        </div>
      )}
    </Card>
  );
};

export default TopBanker; 