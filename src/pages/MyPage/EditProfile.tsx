import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../hoc/store';
import { AxiosResponse } from 'axios';
import { bankerMypageService } from '../../services/bankerMypage.service';
import { BankerInfoResponeDTO, BankerInfoUpdateDTO, CustomerInfoResponseDTO, CustomerInfoUpdateDTO } from '../../types/dto/mypage.dto';
import { customerMypageService } from '../../services/customerMypage.service';

const { Option } = Select;

const EditProfile: React.FC = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoResponseDTO>({
    customerName: '',
    customerEmail: '',
    nickname: '',
    phone: ''
  })

  const [bankerInfo, setBankerInfo] = useState<BankerInfoResponeDTO>({
    bankerName: '',
    bankerEmail: '',
    branchName: '',
  });

  const [newPassword, setNewPassword] = useState<string>('');

  const { isAuthenticated, userId, userRole } = useSelector((state: RootState) => state.auth);

  const getBankerInfo = async () => {
    try {
      const response: AxiosResponse<BankerInfoResponeDTO> = await bankerMypageService.getBankerMyPageInfo(Number(userId));

      if (response && response.data) {
        setBankerInfo(response.data);
      } else {
        console.error('Error fetching data: response.data is undefined');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  const getCustomerInfo = async () => {
    try {
      const response: AxiosResponse<CustomerInfoResponseDTO> = await customerMypageService.getMyPageInfo(Number(userId));

      if (response && response.data) {
        setCustomerInfo(response.data);
      } else {
        console.error('Error fetching data: response.data is undefined');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  useEffect(() => {
    if(userRole=='B'){
      getBankerInfo();
    }else if(userRole=='C'){
      getCustomerInfo();
    }
  }, [userId, userRole]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(!isAuthenticated){
      message.error('로그인을 해주세요.')
      return;
    }
    if (!value) {
      return;
    }

    if(name=='password'){
      setNewPassword(value)
    }else if (userRole === 'B') {
      setBankerInfo((prevBanker) => ({
        ...prevBanker,
        [name]: value,
      }));
    }else if (userRole === 'C'){
      setCustomerInfo((prevCustomer) => ({
        ...prevCustomer,
        [name]: value,
      }));
    }
  };

  const handleGenderChange = (value: string) => {
    setCustomerInfo({ ...customerInfo, gender: value });
  };

  const handleSave = async () => {
    if(!newPassword){
      message.error("새 비밀번호를 입력하세요!")
      return;
    }
    if (isAuthenticated && userRole === 'C') {
      try {
        const modifyInfo: CustomerInfoUpdateDTO = {
          password: newPassword,
          nickname:customerInfo.nickname,
          birthDate:customerInfo.birthDate,
          gender:customerInfo.gender,
          location:customerInfo.location,
          phone:customerInfo.phone
        }
        await customerMypageService.modifyMyPageInfo(Number(userId), modifyInfo);
        message.success('개인정보가 성공적으로 수정되었습니다!');
      } catch {
        message.error('개인정보 수정에 실패했습니다.')
      }
    }
    else if (isAuthenticated && userRole === 'B') {
      try {
        const modifyInfo: BankerInfoUpdateDTO = {
          password: newPassword,
          branchName: bankerInfo.branchName
        }
        await bankerMypageService.modifyBankerInfo(Number(userId), modifyInfo);
        message.success('개인정보가 성공적으로 수정되었습니다!');
      } catch {
        message.error('개인정보 수정에 실패했습니다.')
      }

    }
    else {
      message.error('필수 정보를 입력하세요.');
    }
  };

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5%' }}>개인정보 수정</div>
      <Form
        layout="horizontal"
        labelCol={{ span: 8 }} // 라벨의 너비를 8로 설정하여 고정된 너비 유지
        wrapperCol={{ span: 16 }} // 입력 필드의 너비를 16으로 설정하여 일렬로 맞춤
        labelAlign="left" // 라벨을 왼쪽 정렬
        colon={false} // 라벨 콜론(:) 제거
      >
        <Form.Item label="이름" style={{ marginBottom: '20px' }}> {/* 필드 간 간격 설정 */}
          <Input value={customerInfo?.customerName || bankerInfo?.bankerName} name="name" disabled style={{ backgroundColor: '#f5f5f5', height: '40px' }} /> {/* 높이 조정 */}
        </Form.Item>
        <Form.Item label="이메일" style={{ marginBottom: '20px' }}> {/* 필드 간 간격 설정 */}
          <Input value={customerInfo?.customerEmail || bankerInfo?.bankerEmail} name="email" disabled style={{ backgroundColor: '#f5f5f5', height: '40px' }} /> {/* 높이 조정 */}
        </Form.Item>
        <Form.Item label="비밀번호" required style={{ marginBottom: '20px' }}> {/* 필드 간 간격 설정 */}
          <Input.Password name="password" onChange={handleInputChange} placeholder="8자 이상 비밀번호 입력" style={{ height: '40px' }} /> {/* 높이 조정 */}
        </Form.Item>
        <Form.Item label="비밀번호 확인" required style={{ marginBottom: '20px' }}> {/* 필드 간 간격 설정 */}
          <Input.Password name="passwordConfirm" onChange={handleInputChange} placeholder="비밀번호 확인" style={{ height: '40px' }} /> {/* 높이 조정 */}
        </Form.Item>
        {(isAuthenticated && userRole==='C') && (
          <>
            <Form.Item label="닉네임" required 
              style={{ marginBottom: '20px' }}> {/* 필드 간 간격 설정 */}
              <div style={{ display: 'flex', gap: '10px' }}> {/* flexbox를 사용하여 버튼을 오른쪽에 배치 */}
                <Input value={customerInfo?.nickname} name="nickname" onChange={handleInputChange} style={{ height: '40px' }} /> {/* 높이 조정 */}
                <Button type="primary" style={{height: '40px'}}>중복 확인</Button>
              </div>
            </Form.Item>
            <Form.Item label="생년월일" style={{ marginBottom: '20px' }}> {/* 필드 간 간격 설정 */}
              <Input value={customerInfo?.birthDate} name="birthDate" placeholder="연도-월-일" onChange={handleInputChange} style={{ height: '40px' }} /> {/* 높이 조정 */}
            </Form.Item>
            <Form.Item label="성별" style={{ marginBottom: '20px' }}> {/* 필드 간 간격 설정 */}
              <Select value={customerInfo?.gender} onChange={handleGenderChange} style={{ height: '40px' }}>
                <Option value="M">남성</Option>
                <Option value="F">여성</Option>
              </Select>
            </Form.Item>
            <Form.Item label="시/구" style={{ marginBottom: '20px' }}> {/* 필드 간 간격 설정 */}
              <Input value={customerInfo?.location} name="location" onChange={handleInputChange} style={{ height: '40px' }} /> {/* 높이 조정 */}
            </Form.Item>
            <Form.Item label="전화번호" required style={{ marginBottom: '20px' }}> {/* 필드 간 간격 설정 */}
              <Input value={customerInfo?.phone} name="phone" placeholder="예시) 010-1234-5678" onChange={handleInputChange} style={{ height: '40px' }} /> {/* 높이 조정 */}
            </Form.Item>
          </>
        )}
        {(isAuthenticated && userRole==='B') && (
          <Form.Item label="지점명" required style={{ marginBottom: '20px' }}> {/* 필드 간 간격 설정 */}
            <Input value={bankerInfo?.branchName} name="branchName" onChange={handleInputChange} style={{ height: '40px' }} /> {/* 높이 조정 */}
          </Form.Item>
        )}
        
        <Button type="primary" onClick={handleSave} style={{ width: '100%', marginTop: '20px', height: '50px' }}> {/* 저장 버튼 높이 설정 */}
          저장
        </Button>
      </Form>
    </>
  );
};

export default EditProfile;