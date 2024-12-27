import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message, Tooltip } from 'antd';
import { HomeOutlined, CalendarOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import userIcon from '../../../../assets/img/icon_user.png';
import { relativeTime } from '../../../../utils/stringFormat';
import { AnswerResponseDTO } from '../../../../types/dto/answer.dto';
import { myPageService } from '../../../../services/mypage.service';
import { BankerMyPageReturnDTO } from '../../../../types/dto/banker.dto';
import { qnaService } from '../../../../services/qna.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../hoc/store';

interface AnswerProps {
  answer: AnswerResponseDTO;
}

const Answer: React.FC<AnswerProps> = ({ answer }) => {
  const navigate = useNavigate();

  const [bankerInfo, setBankerInfo] = useState<BankerMyPageReturnDTO | null>(null);
  const [isGood, setIsGood] = useState<boolean>(false);
  const { userId } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchBankerInfo = async () => {
      const response = await myPageService.getBankerMyPage(answer.bankerId);
      setBankerInfo(response.data);
    }
    fetchBankerInfo();
  }, [answer.bankerId]);

  const handleGoodClick = async () => {
    await qnaService.postGood({
      questionId: answer.questionId,
      customerId: Number(userId)
    });
    setIsGood(!isGood);
  }

  const handleProfileBtn = () => {
    navigate(`/bankerProfile/${answer.bankerId}`);
  };

  const handleReserveBtn = () => {
    navigate('/findbank');
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(`${window.location.origin}/qna/${answer.questionId}`);
    message.success("링크가 복사되었습니다.");
  }

  return (
    <>
      <div className='answer flex flex-col border rounded shadow-md'>
        <h1 className='p-5 font-bold bg-pointColor'>
          하나은행 {bankerInfo?.branchName || ''} {bankerInfo?.name || ''} 은행원의 답변
        </h1>
        <div className='p-5 flex flex-col gap-5'>
          <div className='comment__header flex justify-between font-light border-b pb-5'>
            <div className='flex gap-3'>
              <img src={userIcon} alt='user icon' className='w-12 h-12' />
              <div className='flex flex-col gap-1'>
                <div className='flex gap-3'>
                  <span>{bankerInfo?.name} 은행원</span>
                  <div className='bg-gray-300 rounded-full px-3 text-sm self-center'>
                    🎖️ 행원
                  </div>
                </div>
                <span className='text-gray-400 text-xs flex space-x-1 items-center'>
                  {bankerInfo?.specializations.map((tag)=><span>#{tag}</span>)}
                </span>
              </div>
            </div>
            <div className='flex gap-5'>
              <Tooltip title='프로필 보기' color='white'>
                <Button icon={<HomeOutlined />} onClick={handleProfileBtn} />
              </Tooltip>
              <Tooltip title='상담 예약하기' color='white'>
                <Button
                  icon={<CalendarOutlined />}
                  onClick={handleReserveBtn}
                />
              </Tooltip>
            </div>
          </div>
          <p className='comment__body font-light whitespace-pre-line'>{answer.content}</p>
          <div className='comment__footer font-light flex flex-col gap-5'>
            <p className="text-gray-400" style={{fontSize:'13px'}}>
              {relativeTime(+new Date(answer.createdAt))}
            </p>
            <div className='flex justify-between'>
              <Button icon={isGood ? <LikeFilled style={{color: 'orange'}} /> : <LikeOutlined />} onClick={handleGoodClick}>도움돼요</Button>
              <Button onClick={handleShareClick}>🔗 공유</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Answer;