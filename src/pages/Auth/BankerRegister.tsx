import React, { useState, useCallback } from 'react';
import { Banker } from "../../constants/users";
import { Form, Input, Button, message, Select, Space } from 'antd';
import { RuleObject } from 'antd/es/form';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  DownOutlined,
  BankOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Categories } from '../../constants/posts';
import '../../styles/formInput.css';
import wyhn from '../../assets/img/would_you_hana.png';
import { bankerService } from '../../services/banker.service'; 
import { AxiosResponse } from 'axios';


interface formProps {
  email: string;
  password: string;
  passwordConfirm: string;
  authNum: number;
  name: string;
  location: string;
  branchName: string;
}

const InputForm: React.FC<{
  setBanker: React.Dispatch<React.SetStateAction<Banker>>;
  setCompleteInputForm: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setBanker, setCompleteInputForm }) => {
  const [sendAuthNum, setSendAuthNum] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [sendAuthNumMessage, setSendAuthNumMessage] = useState<string>(''); 
  const [verifyMessage, setVerifyMessage] = useState<string>('');


  const validatePassword = (_: RuleObject, value: string): Promise<void> => {
    const passwordPattern = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#^&*]).{8,}$/;
    if (passwordPattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      `비밀번호는 최소 8자 이상이고, 영소문자, 숫자, 특수문자(!, @, #, ^, &, *)를 적어도 하나 포함하여야 합니다.`
    );
  };

  const validatePasswordConfirm = (
    _: RuleObject,
    value: string
  ): Promise<void> => {
    if (
      form.getFieldValue('password') &&
      form.getFieldValue('password') !== value
    ) {
      return Promise.reject('비밀번호가 일치하지 않습니다.');
    }
    return Promise.resolve();
  };

  const handleAuthNum = async () => {

    const email = form.getFieldValue('email')

    // if (findBanker(form.getFieldValue('email'))) {
    //   message.warning('이미 존재하는 이메일입니다.');
    //   return;
    // }

    try {
      setSendAuthNumMessage('이메일 전송중입니다..');
      const response: AxiosResponse<string> = await bankerService.sendVerificationCode(email);

      if (response && response.data) {
        setSendAuthNum(true);
        setSendAuthNumMessage('이메일 발송에 성공했습니다.'); // 성공 메시지 설정
      } else {
        setSendAuthNumMessage('이메일 발송에 실패했습니다.'); // 실패 메시지 설정
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setSendAuthNumMessage('이메일 발송에 실패했습니다.');
    }
  };

  const handleVerifyAuthNum = async () => {
    const email = form.getFieldValue('email');
    const authNum = form.getFieldValue('authNum');

    try {
      const response: AxiosResponse<string> = await bankerService.verifyEmail(email, authNum);
      if (response && response.data === '이메일 인증이 완료되었습니다.') {
        setVerified(true);
        setVerifyMessage('인증에 성공했습니다.'); // 성공 메시지 설정
      } else {
        setVerified(false);
        setVerifyMessage('인증에 실패했습니다.'); // 실패 메시지 설정
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setVerifyMessage('인증에 실패했습니다.');
    }
  };

  const handleRegister = (values: formProps) => {
    if(!verified){
      message.error("이메일 인증이 필요합니다.")
      return;
    }
    // values 중 authNum과 passwordConfirm은 저장 안함
    const { authNum, passwordConfirm, ...rest } = values;
    // void를 이용해 명시적으로 무시
    void authNum;
    void passwordConfirm;

    setBanker({
      ...rest,
      interests: '',
    });
    setCompleteInputForm(true);
  };

  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="bankerRegister"
      onFinish={handleRegister}
      initialValues={{
        email: '',
        password: '',
        passwordConfirm: '',
        authNum: null,
        location: '',
        name: '',
        branchName: '',
      }}
      colon={false}
      size="large"
      scrollToFirstError
    >
      <Form.Item
        // label="이름"
        name="name"
        rules={[{ required: true, message: '이름을 입력해주세요.' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="이름"></Input>
      </Form.Item>

      <Form.Item
        // label="이메일"
        name="email"
        rules={[
          { required: true, message: '이메일을 입력해주세요.' },
          {
            type: 'email',
            message: '올바른 이메일 형식이 아닙니다.',
          },
        ]}
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input prefix={<MailOutlined />} placeholder="이메일" />
            <Button color="default" variant="filled" onClick={handleAuthNum}>
              인증번호 발송
            </Button>
          </div>
          {sendAuthNumMessage && (
            <p className={`text-sm ${sendAuthNum ? 'text-blue-500' : 'text-red-500'}`}>
              {sendAuthNumMessage}
            </p>
          )}
        </div>
      </Form.Item>

      <Form.Item
        // label="인증번호"
        name="authNum"
        rules={[{ required: true, message: '인증번호를 입력해주세요.' }]}
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              prefix={<MailOutlined />}
              disabled={!sendAuthNum}
              placeholder="인증번호"
            />
            <Button color="default" variant="filled" onClick={handleVerifyAuthNum}>
              인증 확인
            </Button>
          </div>
          {verifyMessage && (
            <p className={`text-sm ${verified ? 'text-blue-500' : 'text-red-500'}`}>
              {verifyMessage}
            </p>
          )}
        </div>
      </Form.Item>

      <Form.Item
        // label="비밀번호"
        name="password"
        rules={[
          { required: true, message: '비밀번호를 입력해주세요.' },
          { validator: validatePassword },
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
      </Form.Item>

      <Form.Item
        // label="비밀번호 확인"
        name="passwordConfirm"
        rules={[
          { required: true, message: '비밀번호를 확인해주세요.' },
          { validator: validatePasswordConfirm },
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} placeholder="비밀번호 확인" />
      </Form.Item>
      <Form.Item
        // label="주소(구)"
        name="location"
        rules={[{ required: true, message: '지점이 위치한 지역구를 입력해주세요.' }]}
      >
        <Space.Compact block size="large">
          <Button icon={<HomeOutlined />}></Button>
          <Input placeholder="서울시" disabled />
          <Input placeholder="지점이 속한 구) ex: 광진구" />
        </Space.Compact>
      </Form.Item>

      <Form.Item
        // label="지점명"
        name="branchName"
        rules={[{ required: true, message: '지점명을 입력해주세요.' }]}
      >
        <Input prefix={<BankOutlined />} placeholder="지점명" />
      </Form.Item>

      <Form.Item label={null}>
        <Button block type="primary" htmlType="submit">
          다음
        </Button>
      </Form.Item>
    </Form>
  );
};

const SelectInterest: React.FC<{
  banker: Banker;
  setBanker: React.Dispatch<React.SetStateAction<Banker>>;
}> = ({ banker, setBanker }) => {
  const MAX_COUNT = 3;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleChange = (value: string[]) => {
    if (value.length <= MAX_COUNT) {
      setSelectedItems(value);
      setBanker((prevBanker) => ({
        ...prevBanker,
        interests: JSON.stringify(value),
      }));
    } else {
      message.warning(`최대 ${MAX_COUNT}개까지 선택할 수 있습니다.`);
    }
  };

  const handleSaveBanker = useCallback(async () => {
  
      try{
        bankerService.registerBanker(banker);
        message.success('회원가입이 완료되었습니다!');
        navigate('/');
      } catch(error){
        console.error('Failed to create User:', error);
        message.error('행원 계정 생성에 실패했습니다.');
      }
      //saveUser(user);
      
      
      
    },[]);

  const suffix = (
    <>
      <span>
        {selectedItems.length} / {MAX_COUNT}
      </span>
      <DownOutlined />
    </>
  );

  return (
    <div className="flex flex-col gap-16 items-center m-auto">
      <div className="flex flex-col items-center gap-8 w-80">
        <div>
          <p>{banker.name} 님의</p>
          <p> 관심 분야를 선택해 주세요!</p>
        </div>

        <Select
          mode="multiple"
          value={selectedItems}
          style={{ width: '100%' }}
          onChange={handleChange}
          suffixIcon={suffix}
          placeholder="선택"
          options={Categories.map((category) => ({
            label: category,
            value: category,
          }))}
          maxTagCount="responsive"
        />

        <Button
          type="primary"
          onClick={handleSaveBanker}
          disabled={selectedItems.length !== MAX_COUNT}
          className="mt-4"
          block
        >
          완료
        </Button>
      </div>
    </div>
  );
};

const BankerRegister: React.FC = () => {
  const [completeInputForm, setCompleteInputForm] = useState<boolean>(false);
  const [banker, setBanker] = useState<Banker>({
    email: '',
    password: '',
    name: '',
    location: '',
    branchName: '',
    interests: '',
  });

  return (
    <div className="h-fit flex justify-center">
      <div className="w-1/3 h-fit m-10 shadow-lg shadow-gray-300 p-8 flex flex-col gap-6 rounded-md">
        <div className='flex justify-center'>
          <img src={wyhn} className='w-35'></img>
        </div>
        {/* <h2 className="text-lg font-bold text-center">WOULD YOU HANA</h2> */}
        {completeInputForm ? (
          <SelectInterest banker={banker} setBanker={setBanker} />
        ) : (
          <InputForm
            setBanker={setBanker}
            setCompleteInputForm={setCompleteInputForm}
          />
        )}
      </div>
    </div>
  );
};

export default BankerRegister;
