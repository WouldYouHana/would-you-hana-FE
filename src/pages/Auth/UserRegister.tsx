import React, { useState, useCallback } from 'react';
import { User } from "../../constants/users";
import { hasNickname } from '../../utils/userStorage';
import { RuleObject } from 'antd/es/form';
import { Form, Input, Button, message, Select, Radio, Space } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Categories } from '../../constants/posts';
import '../../styles/formInput.css';
import wyhn from '../../assets/img/would_you_hana.png';
import { userService } from '../../services/user.service';
import { AxiosResponse } from 'axios';

// 회원가입 폼 입력할 때의 데이터 타입
interface formProps {
  name: string;
  nickname: string;
  email: string;
  authNum: number;
  password: string;
  passwordConfirm: string;
  location: string;
  gender: 'M' | 'F';
  phone: string;
  birthDate: string;
}

const InputForm: React.FC<{
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setCompleteInputForm: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setUser, setCompleteInputForm }) => {
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false);
  const [nicknameDuplicate, setNicknameDuplicate] = useState<boolean>(false);
  const [nicknameError, setNicknameError] = useState<boolean>(false);
  const [sendAuthNum, setSendAuthNum] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [sendAuthNumMessage, setSendAuthNumMessage] = useState<string>(''); 
  const [verifyMessage, setVerifyMessage] = useState<string>('');

  const validatePhone = (_: RuleObject, value: string): Promise<void> => {
    const phonePattern = /^(01[0-9]{1,3})-([0-9]{3,4})-([0-9]{4})$/;
    if (phonePattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject('전화번호는 10자리 또는 11자리 숫자여야 합니다.');
  };

  const validateBirthDate = (_: RuleObject, value: string): Promise<void> => {
    if (value.length < 10) {
      return Promise.reject('생년월일은 YYYYMMDD 형식이어야 합니다.');
    } else {
      const [year, month, day] = value.split('.');
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      if (
        date.getFullYear() !== Number(year) ||
        date.getMonth() !== Number(month) - 1 ||
        date.getDate() !== Number(day)
      ) {
        return Promise.reject('유효한 날짜가 아닙니다.');
      }
    }
    return Promise.resolve();
  };

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
        7
      )}`;
    }
  };

  const formatBirthDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 4)}.${cleaned.slice(4)}`;
    } else {
      return `${cleaned.slice(0, 4)}.${cleaned.slice(4, 6)}.${cleaned.slice(
        6
      )}`;
    }
  };

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
    // if (findUser(form.getFieldValue('email'))) {
    //   message.warning('이미 존재하는 이메일입니다.');
    //   return;
    // }
    const email = form.getFieldValue('email');
    try {
      setSendAuthNumMessage('이메일 전송중입니다..');
      const response: AxiosResponse<string> = await userService.sendVerificationCode(email);

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
      const response: AxiosResponse<string> = await userService.verifyEmail(email, authNum);
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

    setUser({
      ...rest,
      favoriteLocations:[values.location],
      interests: '',
    });
    setCompleteInputForm(true);
  };

  const checkNickname = () => {
    const nickname: string = form.getFieldValue('nickname');
    setNicknameDuplicate(hasNickname(nickname));
    setIsNicknameChecked(true);
    const nicknamePattern = /^[a-zA-Z가-힣0-9]{2,10}$/;
    setNicknameError(!nicknamePattern.test(nickname));
  };

  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="userRegister"
      onFinish={handleRegister}
      initialValues={{
        name: '',
        nickname: '',
        email: '',
        authNum: null,
        password: '',
        passwordConfirm: '',
        location: '',
        gender: 'M',
        phone: '',
        birthDate: '',
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
        // label="닉네임"
        name="nickname"
        rules={[
          { required: true, message: '닉네임을 입력해주세요.' },
          { min: 2, message: '닉네임은 최소 2자 이상이어야 합니다.' },
          { max: 10, message: '닉네임은 최대 10자까지 입력 가능합니다.' },
        ]}
      >
        <div>
          <div className="flex gap-2">
            <Input prefix={<UserOutlined />} placeholder="닉네임" />
            <Button color="default" variant="filled" onClick={checkNickname}>
              중복 확인
            </Button>
          </div>
          {isNicknameChecked && nicknameDuplicate && !nicknameError ? (
            <p className="text-red-500">이미 사용중인 닉네임입니다.</p>
          ) : isNicknameChecked && !nicknameError ? (
            <p className="text-blue-500">사용 가능한 닉네임입니다.</p>
          ) : null}
        </div>
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
        rules={[{ required: true, message: '주소를 입력해주세요.' }]}
      >
        <Space.Compact block size="large">
          <Button icon={<HomeOutlined />}></Button>
          <Input placeholder="서울시" disabled />
          <Input placeholder="주소(구) ex: 광진구" />
        </Space.Compact>
      </Form.Item>

      <Form.Item
        // label="성별"
        name="gender"
        rules={[{ required: true, message: '성별을 선택해주세요.' }]}
      >
        <Radio.Group block>
          <Radio.Button value="M">남성</Radio.Button>
          <Radio.Button value="F">여성</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        // label="전화번호"
        name="phone"
        rules={[
          {
            required: true,
            message: '전화번호를 입력해주세요.',
          },
          {
            validator: validatePhone,
          },
        ]}
      >
        <Input
          prefix={<PhoneOutlined />}
          placeholder="전화번호"
          onChange={(e) => {
            const formattedPhone = formatPhoneNumber(e.target.value);
            form.setFieldValue('phone', formattedPhone);
          }}
        />
      </Form.Item>

      <Form.Item
        // label="생년월일"
        name="birthDate"
        rules={[
          {
            required: true,
            message: '생년월일을 입력해주세요.',
          },
          {
            validator: validateBirthDate,
          },
        ]}
      >
        <Input
          prefix={<CalendarOutlined />}
          placeholder="생년월일 (YYYYMMDD)"
          onChange={(e) => {
            const formattedDate = formatBirthDate(e.target.value);
            form.setFieldValue('birthDate', formattedDate);
          }}
        />
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
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}> = ({ user, setUser }) => {
  const MAX_COUNT = 3;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleChange = (value: string[]) => {
    console.log(user);
    if (value.length <= MAX_COUNT) {
      setSelectedItems(value);
      setUser((prevUser) => ({
        ...prevUser,
        interests: JSON.stringify(value),
      }));
    } else {
      message.warning(`최대 ${MAX_COUNT}개까지 선택할 수 있습니다.`);
    }
  };

  const handleSaveUser = useCallback(async () => {

    try{
      userService.registerUser(user);
      message.success('회원가입이 완료되었습니다!');
      navigate('/');
    } catch(error){
      console.error('Failed to create User:', error);
      message.error('유저 생성에 실패했습니다.');
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
          <p>{user.nickname} 님의</p>
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
          onClick={handleSaveUser}
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

const UserRegister: React.FC = () => {
  const [completeInputForm, setCompleteInputForm] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
    nickname: '',
    name: '',
    gender: 'M',
    phone: '',
    birthDate: '',
    location:'',
    favoriteLocations: [],
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
          <SelectInterest user={user} setUser={setUser} />
        ) : (
          <InputForm
            setUser={setUser}
            setCompleteInputForm={setCompleteInputForm}
          />
        )}
      </div>
    </div>
  );
};

export default UserRegister;
