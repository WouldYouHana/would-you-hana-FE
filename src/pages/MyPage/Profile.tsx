import React from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../hoc/store';
import CustomerInfo from '../../components/my/CustomerInfo';
import Activity from '../../components/my/Activity';
import BankerInfo from '../../components/my/BankerInfo';
// import BankerCards from '../../components/BankerCards';

const { Content } = Layout;

const CustomerProfile: React.FC = () => {
  return (
    <Layout style={{ backgroundColor: '#FFFFFF' }}>
      {/* 상단 유저 정보 */}
      <CustomerInfo />
      <Content style={{ padding: '24px' }}>
        {/* 내 정보 및 이 주의 활약 */}
        <Activity />

        {/* 나에게 답변해준 은행원 */}
        {/* <div className="mt-20">
          <h1 className="text-lg font-bold mb-5">나에게 답변해준 행원</h1>
          <BankerCards></BankerCards>
        </div> */}
      </Content>
    </Layout>
  );
};

const BankerProfile: React.FC = () => {
  return (
    <>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
        프로필
      </h3>
      {/* 행원 정보 */}
      <BankerInfo />
      {/* 내 정보 및 이 주의 활약 */}
      <Activity />
    </>
  );
};

const Profile: React.FC = () => {
  const userRole = useSelector((state: RootState) => state.auth.userRole);

  return <>{userRole == 'C' ? <CustomerProfile /> : <BankerProfile />}</>;
};

export default Profile;
