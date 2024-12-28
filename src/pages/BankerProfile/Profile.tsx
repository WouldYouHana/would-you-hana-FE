import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Typography } from 'antd';
import { PhoneFilled, DesktopOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { BankerMyPageReturnDTO } from '../../types/dto/banker.dto';
import { useParams } from 'react-router-dom';
import bankerImg from '../../assets/img/banker1.png';



import BankerCards from '../../components/BankerCards';
import { myPageService } from '../../services/mypage.service';
import ReservationModal from '../../components/ReservationModal';
const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { bankerId } = useParams<{ bankerId: string }>();

  const [bankerInfo, setBankerInfo] = useState<BankerMyPageReturnDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBankerInfo = async () => {
      const response = await myPageService.getBankerMyPage(Number(bankerId));
      setBankerInfo(response.data);
    }
    fetchBankerInfo();
  }, [bankerId]);


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

    return (
        <div className="w-full px-[15%] py-5">
             <h1 className="text-2xl font-bold mb-6">하나가족 소개</h1>
            {/* Main Profile and Q&A Section */}
            <Row gutter={16} className="flex">
                <Col span={16} className="flex flex-col">
                    <Card className="flex-grow rounded-2xl border border-[#d3d3d3]" bodyStyle={{ padding: 0 }}>
                        <Row>
                            <div className="w-full bg-mainColor text-right text-white py-2.5 rounded-t-2xl px-5">
                              하나은행 {bankerInfo?.branchName}
                            </div>
                            <img src={bankerInfo?.filePath||bankerImg} alt="Profile" className="w-full mb-5" />
                        </Row>
                        <Row>
                            <Col span={24} className="px-5">
                                <Row justify="space-between" align="middle" className="mb-2.5">
                                    <Title level={4}>{bankerInfo?.name}</Title>
                                </Row>
                                <div className="mb-2.5">
                                    {bankerInfo?.specializations.map(hashTag => (
                                        <Button
                                            key={hashTag}
                                            type="primary"
                                            ghost
                                            className="mr-2 mb-2 bg-[#F7FDFD] text-xs p-2.5"
                                        >
                                            {hashTag}
                                        </Button>
                                    ))}
                                </div>
                                <hr/>
                                <div className="my-5 text-base font-light">{bankerInfo?.content}</div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Q&A and Contact Section */}
                <Col span={8} className="flex flex-col">
                    <Card className="mb-2.5 rounded-2xl border border-[#d3d3d3]" bodyStyle={{ padding: 15 }}>
                        <div>
                            <div className="mb-2.5 font-bold text-lg">상담시간</div>
                            <p className='text-lg'><ClockCircleOutlined className='mr-1' /> 평일 10:00 - 18:00</p>
                            <p className='ml-5 text-xs text-red-500'>주말 및 공휴일 제외</p>
                        </div>
                    </Card>

                    <Card className="flex text-center justify-center mb-2.5 rounded-2xl border border-[#d3d3d3]" bodyStyle={{ padding: 15 }}>
                        <div className="mb-2.5">
                            <div className="text-2xl font-bold">
                                <span className="text-mainColor">우주</span>하나
                                <span className="text-mainColor"> 하나</span>가족
                            </div>
                            <br />
                            <Text >우주하나 Q&A 서비스를 통해</Text><br />
                            <Text >금융 관련 답변을 제공합니다.</Text><br />
                            <br />
                            <span className="mr-1">
                                {<PhoneFilled />}
                            </span>
                            <span>고객센터</span><br />
                            <span>1599-1111, 1588-1111</span><br />
                            <span>(개인 0-4번, 법인 0-5번)</span><br />
                        </div>
                    </Card>

                    <Button 
                        onClick={() => window.open('https://www.kebhana.com/cont/customer/customer02/index.jsp', "_blank")} 
                        icon={<DesktopOutlined />} 
                        type="primary" 
                        block 
                        className="mb-2.5 py-7 rounded-2xl"
                    >
                        PC 화면 원격 상담하기
                    </Button>
                    <Button 
                        icon={<ClockCircleOutlined />} 
                        type="default" 
                        block 
                        className="mb-2.5 py-7 bg-black text-white rounded-2xl"
                        onClick={showModal}
                    >
                        원하는 시간에 상담 예약하기
                    </Button>
                </Col>
            </Row>

            {/* Similar Specialists Section */}
            <div className="mt-7">
                <h1 className="text-2xl font-bold mb-6">같은 지점</h1>
                <BankerCards exceptBankerId={Number(bankerId)}></BankerCards>
            </div>
           
        <ReservationModal isOpen={isModalOpen} onOk={handleOk} onCancel={handleCancel} selectedBranchName={bankerInfo?.branchName || '지점정보없음'} selectedBankerName={bankerInfo?.name||null}/>

        </div>
    );
};

export default Profile;