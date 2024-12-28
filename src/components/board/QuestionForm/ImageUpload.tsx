import { message } from 'antd';
import React, { useEffect } from 'react';

interface ImageUploadProps {
  fileList: File[];
  onChange: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ fileList, onChange }) => {
  // 컴포넌트가 언마운트될 때 생성된 blob URL 해제
  useEffect(() => {
    return () => {
      fileList.forEach(file => {
        if ('preview' in file) {
          URL.revokeObjectURL((file as any).preview);
        }
      });
    };
  }, [fileList]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + fileList.length > 5) {
      message.error('이미지는 최대 5개까지 업로드할 수 있습니다.');
      return;
    }

    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        message.error('이미지 파일만 업로드할 수 있습니다.');
        return false;
      }
      if (!isLt2M) {
        message.error('이미지 크기는 2MB보다 작아야 합니다.');
        return false;
      }

      // 미리보기 URL을 한 번만 생성
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
      
      return true;
    });

    onChange([...fileList, ...validFiles]);
    e.target.value = ''; // input 초기화
  };

  const removeFile = (index: number) => {
    const removedFile = fileList[index];
    if ('preview' in removedFile) {
      URL.revokeObjectURL((removedFile as any).preview);
    }
    const newFileList = fileList.filter((_, i) => i !== index);
    onChange(newFileList);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
        >
          이미지 추가
        </label>
        <span className="text-sm text-gray-500">
          {fileList.length}/5 파일 선택됨
        </span>
      </div>

      {fileList.length > 0 && (
        <div className="grid grid-cols-5 gap-4">
          {fileList.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={(file as any).preview}
                alt={`preview ${index}`}
                className="w-full h-24 object-cover rounded"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 