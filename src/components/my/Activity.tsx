import { useSelector } from 'react-redux';
import { RootState } from '../../hoc/store';
import { Layout } from 'antd';
import {
  HeartOutlined,
  MessageOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import star4 from '../../assets/img/stars/star4.png';
import { useEffect, useState } from 'react';
import { BankerMyPageReturnDTO } from '../../types/dto/banker.dto';
import { myPageService } from '../../services/mypage.service';
const { Content } = Layout;

/* 내 정보 및 이 주의 활약 */
const Activity: React.FC = () => {
  const {userId,userRole} = useSelector((state: RootState) => state.auth);

  const [activity, setActivity] = useState<BankerMyPageReturnDTO>();

  useEffect(() => {
    const fetchActivity = async () => {
      const response = await myPageService.getBankerMyPage(Number(userId));
      setActivity(response.data);
    };
    fetchActivity();
  }, [userId]);

  return (
    <Content>
      <div style={{ display: 'flex', gap: '30px' }}>
        <div
          style={{
            width: '100%',
            backgroundColor: '#f5f5f5',
            padding: '24px',
            borderRadius: '24px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '15px',
            }}
          >
            내 정보
          </div>
          <div
            style={{ paddingTop:'30px', display: 'flex', gap: '10px', justifyContent:'space-between', alignItems:'center'}}
          >
            <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:'18px'}}>
              <HeartOutlined style={{fontSize: '20px'}}/> 
              <p style={{fontSize: '16px'}}>{userRole=='C'?'좋아요':'도움돼요'} <span id="likes-count" className='text-mainColor'>{activity?.totalGoodCount||0}</span></p>
            </div>
            <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:'18px'}}>
              <MessageOutlined style={{fontSize: '20px'}}/> 
              <p style={{fontSize: '16px'}}>답변수 <span id="answers-count" className='text-mainColor'>{activity?.totalCommentCount||0}</span></p>
            </div>
            <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:'18px'}}>
              <CommentOutlined style={{fontSize: '20px'}}/> 
              <p style={{fontSize: '16px'}}>조회수 <span id="comments-count" className='text-mainColor'>{activity?.totalViewCount||0}</span></p>
            </div>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            backgroundColor: '#f5f5f5',
            padding: '24px',
            borderRadius: '24px',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            이 주의 활약
          </div>
          <div className="flex justify-center">
            <img className="h-40" src={star4} alt="star4" />
          </div>
        </div>
      </div>
    </Content>
  );
};

export default Activity;
