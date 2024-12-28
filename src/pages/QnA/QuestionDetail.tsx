import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { StarOutlined, StarFilled, FormOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../hoc/store';
import {QuestionResponseDTO} from '../../types/dto/question.dto';
import Answer from '../../components/board/QuestionDetail/AnswerSection/Answer';
import AnswerInput from '../../components/board/QuestionDetail/AnswerSection/AnswerInput';
import Comments from '../../components/board/QuestionDetail/Comments/Comments';
import PostRegisterButton from '../../components/board/PostRegisterButton/PostRegisterButton';
import Chatbot from '../../components/Chatbot';
import { relativeTime } from '../../utils/stringFormat';
import { qnaService } from '../../services/qna.service';
import { likesscrapService } from '../../services/likesscrap.service';


const QuestionDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState<QuestionResponseDTO | null>(null);
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [isScraped, setIsScraped] = useState<boolean>(false);
  const { userRole, userId } = useSelector((state: RootState) => state.auth);
  const [ isMyQna, setIsMyQna] = useState<boolean>(false);

  // 게시글 조회
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!postId) {
        message.error('질문 ID가 없습니다.');
        navigate('/404');
        return;
      }

      try {
        const response = await qnaService.getQuestionDetail(Number(postId));
        console.log("question",response.data);
        setQuestion(response.data);
        setIsMyQna(response.data.customerId === userId); // 내가 작성한 글인 경우 true
      } catch (error) {
        console.error('Failed to fetch question:', error);
        message.error('게시글을 불러오는데 실패했습니다.');
        navigate('/404');
      }
    };

    const fetchIsScraped = async () =>{
      try{
        const response = await likesscrapService.getIsQuestionScrapChecked(Number(userId), Number(postId));
        setIsScraped(response.data);
      }catch(error){
        console.error('Failed to fetch scrap info:', error);
      }
    }

    fetchQuestion();
    fetchIsScraped();
  }, [postId, navigate, userId]);

  // 답변 제출
  const handleAnswerSubmit = useCallback(async (content: string) => {
    if (!postId || !question || !userId) return;

    try {
      // 답변 등록 API 호출 
      await qnaService.postAnswer(parseInt(postId), {
        bankerId: userId,
        content
      });

      // 답변 등록 후 게시글 새로고침
      const updatedQuestion = await qnaService.getQuestionDetail(parseInt(postId));
      setQuestion(updatedQuestion.data);
      setShowAnswerInput(false);
      console.log(showAnswerInput)
      message.success('답변이 등록되었습니다.');
    } catch (error) {
      console.error('Failed to submit answer:', error);
      message.error('답변 등록에 실패했습니다.');
    }
  }, [postId, question, userId]);

  // 게시글 삭제
  const handleQuestionDelete = useCallback(async () => {
    if (!postId) return;

    try {
      await qnaService.deleteQuestion(parseInt(postId));
      message.success('게시글이 삭제되었습니다.');
      navigate('/qna');
    } catch (error) {
      console.error('Failed to delete question:', error);
      message.error('게시글 삭제에 실패했습니다.');
    }
  }, [postId, navigate]);

  // 스크랩 클릭
  const handleScrapClick = async () => {
    if (!postId || !userId) return;
    await likesscrapService.scrapQuestion({questionId: parseInt(postId), customerId: Number(userId)});
    setIsScraped(!isScraped);
  };

  const toggleChatbot = useCallback(() => {
    setIsChatbotVisible(prev => !prev);
  }, []);

  if (!question) return null;

  return (
    <div className="w-full px-[15%] py-10">
      <div className="flex gap-5">
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-6 pb-3 border-b border-gray-200">
            <div className="flex flex-col gap-3">
              <h2 className="text-md text-gray-400">{question.categoryId}</h2>
                <h1 className="text-3xl font-bold">
                  Q. {question.title}
                </h1>
                <div className="flex gap-1 text-gray-400" style={{fontSize: '13px'}}>
                  <span>조회 {question.viewCount}</span>
                  <span>·</span>
                  <span>{question.nickname}</span>
                </div>
                <div className="flex justify-end gap-2">
                  {question.answer === null && userRole === 'B' && (
                      <Button
                          type="primary"
                          icon={<FormOutlined/>}
                          onClick={() => setShowAnswerInput(true)}
                      >
                        답변하기
                      </Button>
                  )}
                  {isMyQna && (
                      <Button
                          icon={<DeleteOutlined/>}
                          onClick={handleQuestionDelete}
                      >
                        삭제
                      </Button>
                  )}
                  {userRole == 'C' && (
                      <Button icon={isScraped ? <StarFilled style={{color: 'orange'}}/> : <StarOutlined/>}
                              onClick={handleScrapClick}>스크랩</Button>
                  )}
                </div>
            </div>

            {/* 게시글 내용 */}
            <div className="w-full">
              <p>{question.content}</p>
              <div className="flex gap-2 mt-8">
                {question.filePaths.map((filePath, index) => (
                  <img 
                    src={filePath} 
                    alt={`file-${index}`} 
                    key={index} 
                    className="h-[180px] w-[180px] object-cover rounded-md border border-gray-200" 
                    onClick={() => window.open(filePath, '_blank')}
                  />
                ))}
              </div>
            </div>

            {/* 게시글 푸터 */}
            <div className="text-gray-400" style={{fontSize:'13px'}}>
              <span>{relativeTime(+new Date(question.createdAt))}</span>
              <span className="ml-4">
                <MessageOutlined /> {question.commentList.length} 
              </span>
            </div>
          </div>

          {question.answer ? (
            <Answer answer={question.answer} />
          ) : (
            showAnswerInput && (
              <AnswerInput
                question={{ title: question.title, content: question.content }}
                onSubmitAnswer={handleAnswerSubmit}
                onChatbotToggle={toggleChatbot}
              />
            )
          )} 

          <Comments
            type="question"
            commentList={question.commentList}
          />
        </div>

        <aside className="w-[300px]">
          {userRole == 'C' && (
            <PostRegisterButton />
          )}

          {isChatbotVisible && (
            <div className="fixed top-[120px] right-[10%] z-50">
              <Chatbot onClose={toggleChatbot} />
            </div>
          )}
        </aside>
      </div>

    </div>
  );
};

export default QuestionDetail;
