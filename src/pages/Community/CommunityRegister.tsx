import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, message, Input, Button } from 'antd';
import { CommunityCategories } from '../../constants/posts';
import ImageUpload from '../../components/board/QuestionForm/ImageUpload';
import { communityService } from '../../services/community.service';
import { CommunityRegisterDTO } from '../../types/dto/community.dto';
import { useSelector } from 'react-redux';
import { RootState } from '../../hoc/store';

const { TextArea } = Input;

const MAX_TITLE_LENGTH = 30;
const MAX_CONTENT_LENGTH = 5000;

const CommunityRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    customerId: '',
    categoryName: '',
    location: '',
    content: '',

  });
  const [fileList, setFileList] = useState<File[]>([]);
  const { userId, userLocation } = useSelector((state: RootState) => state.auth);

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

    try {
      const form = new FormData();
      
      const post: CommunityRegisterDTO = {
        title,
        customerId: Number(userId),
        categoryName,
        location: userLocation || '성동구',
        content
      };

      // post JSON 데이터 추가
      form.append('question', new Blob([JSON.stringify(post)], {
        type: 'application/json'
      }));

      // 파일 데이터 추가 - 백엔드의 MultipartFile List와 매칭
      fileList.forEach(file => {
        form.append('file', file);  // 'files'는 백엔드의 매개변수명과 일치해야 함
      });

      await communityService.postCommunityPost(form);
      message.success('게시글이 등록되었습니다!');
      navigate('/community');
    } catch (error) {
      console.error('Failed to create post:', error);
      message.error('게시글 등록에 실패했습니다.');
    }
  }, [formData, fileList, userId, userLocation, navigate]);

  return (
    <div className="w-full px-[25%] flex flex-col items-start">
      <h1 className="text-3xl font-bold mt-8 mb-10 leading-tight">
        <p>
          <span className="text-mainColor">내 주변의 커뮤니티</span>에<br />
          글을 남겨보세요!
        </p>
      </h1>

      <Select
        showSearch
        className="w-full h-[50px]"
        placeholder="카테고리 선택"
        optionFilterProp="label"
        onChange={(value) => setFormData(prev => ({ ...prev, categoryName: value }))}
        options={CommunityCategories.map(categoryName => ({
          value: categoryName,
          label: categoryName
        }))}
      />

      <div className="w-full mt-10">
        <div className="mb-6">
          <label className="block mb-2">제목</label>
          <div className="relative">
            <Input
              name="title"
              placeholder="제목을 작성해 주세요."
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
            placeholder={`· 커뮤니티 가이드라인을 준수해주세요.\n· 개인정보(본명, 전화 번호 등)를 쓰면 안 돼요.`}
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

      <div className="w-full bg-[#F3F5F7] p-6 rounded-md mt-5">
        <p className="mb-2.5">이런 경우 글이 삭제될 수 있어요.</p>
        <div className="text-[#7E8082] text-sm space-y-1.5">
          <p>• 개인정보(이름, 전화번호, 주민등록번호, 읍/면/동 이하 상세 주소 등)가 있는 경우</p>
          <p>• 비방, 욕설이 포함된 글을 작성한 경우</p>
          <p>• 유해하거나 예정된 랜딩 페이지로 연결되지 않는 링크를 공유한 경우</p>
        </div>
      </div>

      <Button
        type="primary"
        onClick={handleRegister}
        className="w-full h-[50px] mt-10 mb-10 font-medium"
        size="large"
      >
        게시물 등록
      </Button>
    </div>
  );
};

export default CommunityRegister;
