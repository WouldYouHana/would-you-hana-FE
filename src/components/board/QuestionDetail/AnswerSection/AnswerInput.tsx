import chatbotImg from '../../../../assets/img/img_chatbot.png';
import { Button, Input, message, Tooltip } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { config } from '../../../../config/config';

const { TextArea } = Input;

const BASE_URL = config.aiURL;

interface AnswerInputProps {
  question: {title:string, content:string};
  onSubmitAnswer: (content: string) => void;
  onChatbotToggle: () => void;
}

const Answer: React.FC<AnswerInputProps> = ({ question, onSubmitAnswer, onChatbotToggle }) => {
  const [content, setContent] = useState('');
  const [botResult, setBotResult] = useState("");

  useEffect(()=>{
    if(botResult){
      const template = `안녕하세요, 고객님. 문의주신 사항에 대해 답변드립니다.\n\n${botResult}\n\n감사합니다.`;
      setContent(template); // setAnswerContent는 사용자 입력창의 상태 관리 함수로 가정
    }
  }, [botResult])

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmitAnswer(content); // 상위 컴포넌트로 답변 내용 전달
      setContent(''); // 입력 필드를 초기화
    }
  };

  const handleTemplateClick = async () => {
    setContent('');
    await askChatbot();
   
  };

  const askChatbot = async () =>{
    const input = question.title + " " + question.content

    if (!input?.trim()) return;

    try {
      const response = await axios.post(`https://api.wouldyouhana.site/get_answer`, {
        question: input,
      });
      setBotResult(response.data.answer) // 응답 텍스트
    } catch (error) {
      console.error("Error fetching bot response:", error);
      message.error("서버에 문제가 발생했습니다. 다시 시도해주세요.");
    }
  }
  

  return (
    <>
      <form className='flex flex-col gap-8'>
        <TextArea
          showCount
          placeholder={`· 답변을 입력하세요.\n· 챗봇을 통해 답변 정보를 얻을 수 있어요.`}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          value={content}
          className='h-52'
        />
        <div className='buttons flex justify-between'>
          <Button size='large' onClick={handleTemplateClick}>✍️ AI 답변 생성</Button>
          <div className='flex  gap-5'>
            <Tooltip
              open
              title='챗봇에게 물어보기'
              placement='left'
              color='white'
            >
              <Button
                style={{ backgroundColor: '#1F81FE' }}
                shape='circle'
                size='large'
                icon={<img src={chatbotImg} alt='챗봇 이미지' width={30}
                  onClick={onChatbotToggle}
                />}
              ></Button>
            </Tooltip>

            <Button type='primary' size='large' onClick={handleSubmit}>
              답변 등록
            </Button>
          </div>

        </div>
      </form>
    </>
  );
};

export default Answer;
