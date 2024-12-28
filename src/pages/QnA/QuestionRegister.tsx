import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, message, Input, Button } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../hoc/store';
import { QuestionAddRequestDTO } from '../../types/dto/question.dto';
import { qnaService } from '../../services/qna.service';
import { Categories } from '../../constants/posts';
import ImageUpload from '../../components/board/QuestionForm/ImageUpload';
import TermsCheckbox from '../../components/board/QuestionForm/TermsCheckbox';


const { TextArea } = Input;

const MAX_TITLE_LENGTH = 30;
const MAX_CONTENT_LENGTH = 5000;

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const QuestionRegister: React.FC = () => {
  const navigate = useNavigate();
  const { userId, userLocation } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryName: '',
  });
  const [fileList, setFileList] = useState<File[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);


  const handleChange = (newFiles: File[]) => {
    setFileList(newFiles);
  };

  const handleRegister = useCallback(async () => {
    const { categoryName, title, content } = formData;

    if (!categoryName || !title || !content) {
      message.error('모든 필드를 입력해주세요.');
      return;
    }

    if(!isChecked) {
      message.error('이용약관에 동의해주세요.');
      return;
    }

    if(!userId) {
      message.error('로그인이 필요합니다.');
      return;
    }

    try {
      const form = new FormData();
      
      const question: QuestionAddRequestDTO = {
        title,
        content,
        customerId: userId,
        categoryName,
        location: userLocation || '성동구'
      };

      // question JSON 데이터 추가
      form.append('question', new Blob([JSON.stringify(question)], {
        type: 'application/json'
      }));

      // 파일 데이터 추가 - 백엔드의 MultipartFile List와 매칭
      fileList.forEach(file => {
        form.append('file', file);  // 'files'는 백엔드의 매개변수명과 일치해야 함
      });

      await qnaService.createQuestion(form);
      message.success('질문이 등록되었습니다!');
      navigate('/qna');
    } catch (error) {
      console.error('Failed to create question:', error);
      message.error('질문 등록에 실패했습니다.');
    }
  }, [formData, fileList, isChecked, userId, userLocation, navigate]);

  return (
    <div className="w-full px-[25%] flex flex-col items-start">
      <h1 className="text-3xl font-bold mt-8 mb-10 leading-tight">
        <p>
          질문을 남겨주시면,<br />
          <span className="text-mainColor">내 주변의 하나 가족</span>들이<br />
          빠른 시일 내에 답해드려요!
        </p>
      </h1>

      <Select
        showSearch
        className="w-full h-[50px]"
        placeholder="어떤 분야가 궁금한가요?"
        optionFilterProp="label"
        onChange={(selected) => setFormData(prev => ({ ...prev, categoryName: selected }))}
        options={Categories.map(category => ({
          value: category,
          label: category
        }))}
      />

<div className="w-full mt-10">
        <div className="mb-6">
          <label className="block mb-2">제목</label>
          <div className="relative">
            <Input
              name="title"
              placeholder="궁금한 점을 요약해서 작성해 주세요."
              value={formData.title}
              onChange={handleInputChange}
              maxLength={MAX_TITLE_LENGTH}
              className="rounded-md h-[50px]"
              showCount
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">내용</label>
          <TextArea
              name="content"
              placeholder={`· 자세하게 적으면 좋은 답변을 받을 수 있어요.\n· 개인정보(본명, 전화 번호 등)를 쓰면 안 돼요.\n· 질문에서 내 이름은 보이지 않아요.`}
              value={formData.content}
              onChange={handleInputChange}
              maxLength={MAX_CONTENT_LENGTH}
              className="rounded-md"
              autoSize={{ minRows: 8, maxRows: 12 }}
              showCount={{
                formatter: ({ count, maxLength }) => `${count}/${maxLength}`
              }}
            />
        </div>

        <div className="mb-6">
          <ImageUpload
            fileList={fileList}
            onChange={handleChange}
          />
        </div>
      </div>

      <TermsCheckbox
        isChecked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />

      <Button
        type="primary"
        onClick={handleRegister}
        className="w-full h-[50px] mt-10 mb-10 font-medium"
        size="large"
      >
        질문 등록
      </Button>
    </div>
  );
};

export default QuestionRegister;
