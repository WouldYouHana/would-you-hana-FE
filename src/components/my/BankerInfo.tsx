import React, { useEffect, useState } from 'react';
import { Layout, Button, Input, message } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../hoc/store';
import { BankerProfileModifyDTO } from '../../types/dto/banker.dto';
import { myPageService } from '../../services/mypage.service';
import bankerImg from '../../assets/img/banker1.png';
import { bankerMypageService } from '../../services/bankerMypage.service';

const { Content } = Layout;

const BankerInfo: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const [savedProfile, setSavedProfile] = useState<BankerProfileModifyDTO>({
    name:'김하나',
    bankerId:Number(userId),
    specializations:['이체'],
    content:'안녕하세요.',
    filePath:bankerImg
  });

  // 편집 상태
  const [isComposing, setIsComposing] = useState(false); // IME 조합 상태
  const [editableProfile, setEditableProfile] = useState(savedProfile);
  const [newTag, setNewTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBankerInfo = async () => {
      try {
        const response = await myPageService.getBankerMyPage(Number(userId));
        const { name, specializations, content, filePath } = response.data;
        setSavedProfile({
          bankerId: Number(userId),
          name,
          specializations,
          content,
          filePath: filePath || bankerImg,
        });
      } catch (error) {
        console.error('Failed to fetch banker info:', error);
        message.error('프로필 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchBankerInfo();
  }, [userId]);

  useEffect(() => {
    setEditableProfile(savedProfile);
  }, [savedProfile]);


  // 태그 추가
  const addTag = () => {
    if (newTag && !editableProfile.specializations.includes(newTag.trim())) {
      setEditableProfile({
        ...editableProfile,
        specializations: [...editableProfile.specializations, newTag.trim()],
      });
      setNewTag('');
    }
  };

  // 태그 삭제
  const removeTag = (removedTag: string) => {
    setEditableProfile({
      ...editableProfile,
      specializations: editableProfile.specializations.filter((tag) => tag !== removedTag),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (2MB)
      if (file.size > 2 * 1024 * 1024) {
        message.error('이미지 크기는 2MB보다 작아야 합니다.');
        return;
      }

      // 이미지 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        message.error('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const saveProfile = async () => {
    try {
      const form = new FormData();

      // JSON 데이터 추가
      const profileData = {
        bankerId: editableProfile.bankerId,
        name: editableProfile.name,
        specializations: editableProfile.specializations,
        content: editableProfile.content
      };

      form.append('profile', new Blob([JSON.stringify(profileData)], {
        type: 'application/json'
      }));

      // 파일이 선택된 경우에만 추가
      if (selectedFile) {
        form.append('file', selectedFile);
      }

      await bankerMypageService.modifyBankerProfile(form);
      
      // 성공적으로 저장된 경우 상태 업데이트
      setSavedProfile({
        ...editableProfile,
        filePath: previewUrl || editableProfile.filePath
      });
      setIsEditing(false);
      message.success('프로필이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save profile:', error);
      message.error('프로필 저장에 실패했습니다.');
    }
  };
  return (
    <Content>
      <div className="flex flex-col items-center py-8">
        <div className="w-full flex gap-8">
          {/* 프로필 사진 섹션 */}
          <div className='flex-1 flex flex-col gap-5'>
            <div className="flex flex-col items-center gap-4 mt-5">
              <img
                src={previewUrl || editableProfile.filePath}
                alt="Profile"
                className="w-[400px] h-[200px] rounded-2xl object-cover border border-dashed border-gray-300"
              />
              {isEditing && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  >
                    사진 변경
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className='w-full flex-1 flex flex-col gap-5'>
            {/* 이름 섹션 */}
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>이름</h4>
            <Input
              value={savedProfile.name}
              readOnly
              style={{
                backgroundColor: '#f5f5f5',
                cursor: 'not-allowed',
                fontSize: '16px',
              }}
            />
          </div>

          {/* 태그 섹션 */}
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>태그</h4>

            {isEditing && (
              <div
                style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}
              >
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onCompositionStart={() => setIsComposing(true)} // IME 시작 (한글 처리 에러 방지하기 위해 설정)
                  onCompositionEnd={() => setIsComposing(false)} // IME 종료
                  onPressEnter={() => {
                    if (!isComposing) {
                      addTag();
                    }
                  }}
                  placeholder="새 태그 추가"
                />
                <Button type="primary" onClick={addTag}>
                  추가
                </Button>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {(isEditing
                ? editableProfile.specializations
                : savedProfile.specializations
              ).map((tag, index) => (
                <Button
                  key={index}
                  type="primary"
                  ghost
                  style={{
                    marginRight: '8px',
                    marginBottom: '8px',
                    backgroundColor: '#F7FDFD',
                    fontSize: '12px',
                    padding: '10px',
                  }}
                >
                  #{tag}
                  {isEditing && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(tag);
                      }}
                    >
                      x
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* 자기소개 섹션 */}
          <div>
            <h4
              style={{
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              자기소개
            </h4>
            {isEditing ? (
              <Input.TextArea
                value={editableProfile.content}
                onChange={(e) =>
                  setEditableProfile({
                    ...editableProfile,
                    content: e.target.value,
                  })
                }
                rows={4}
              />
            ) : (
              <p
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                }}
              >
                {savedProfile.content}
              </p>
            )}
          </div>

          {/* 저장/수정 버튼 */}
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            {isEditing ? (
              <Button
                size="large"
                style={{ width: '100px' }}
                block
                onClick={saveProfile}
              >
                저장하기
              </Button>
            ) : (
              <Button
                size="large"
                style={{ width: '100px' }}
                block
                onClick={() => setIsEditing(true)}
              >
                수정하기
              </Button>
            )}
          </div>

          </div>


        </div>
      </div>
    </Content>
  );
};

export default BankerInfo;
