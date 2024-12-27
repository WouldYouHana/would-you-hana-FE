import React, { useState, useEffect } from 'react';
import { Layout, Progress, Avatar } from 'antd';
import userIcon from '../../assets/img/icon_user.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../hoc/store';

const { Content } = Layout;

const getNickname = (): string => {
  const nickname = localStorage.getItem('userNickname');
  return nickname? nickname : 'None'
}

const UserInfo: React.FC = () => {
  const [nicknameOrRealname, setNicknameOrRealname] = useState<string>('Loading...'); // 닉네임 상태 관리
  const isLoggedIn = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userRole = useSelector((state: RootState) => state.auth.userRole);

  // 현재 로그인한 사용자 확인
  useEffect(() => {  
    if (isLoggedIn) {
      const nickname = getNickname();

      if (userRole == 'C') {
        // 고객이라면
        setNicknameOrRealname(nickname); // 닉네임 설정
      } else if (userRole == 'B') {
        // 행원이라면
        setNicknameOrRealname(nickname);
      }
    }
  }, []);

  return (
    <Layout
      style={{
        padding: '24px 50px',
        backgroundColor: '#fff',
        minHeight: '45vh',
      }}
    >
      <Content
        style={{
          textAlign: 'center',
        }}
      >
        {/* 입체적인 아바타 */}
        <Avatar
          size={100}
          src={userIcon}
          style={{
            marginBottom: '20px',
            border: '4px solid #1890ff',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            animation: 'float 3s ease-in-out infinite',
          }}
        />

        {/* 사용자 이름 */}
        <h2
          style={{
            fontSize: '30px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // 텍스트 강조
          }}
        >
          {nicknameOrRealname}
        </h2>

        {/* 포인트 표시 */}
        <p
          style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '20px',
          }}
        >
          🌍 지구 1380 포인트
        </p>

        {/* 진행률 바 */}
        <Progress
          percent={60}
          status="active"
          strokeWidth={12}
          showInfo={true}
          strokeColor={{
            '0%': '#87e8de',
            '100%': '#1890ff',
          }}
          style={{
            width: '100%',
            marginTop: '20px',
            animation: 'progressPop 1.5s ease-in-out',
          }}
        />
      </Content>
    </Layout>
  );
};

export default UserInfo;
