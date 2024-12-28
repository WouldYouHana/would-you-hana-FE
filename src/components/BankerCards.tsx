import { Card, Col, Row, Button, Typography, message } from 'antd';
import { AxiosResponse } from 'axios';
import { bankerService } from '../services/banker.service';
import { BankerListReturnDTO } from '../types/dto/banker.dto';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../hoc/store';

import bankerImg from '../assets/img/banker1.png';

const { Title } = Typography;

interface bankerCardProps{exceptBankerId?:number}

const BankerCard: React.FC<bankerCardProps> = ({exceptBankerId}) => {
  const [bankers, setBankers] = useState<BankerListReturnDTO[]>([]);
  const {userLocation} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    getBankerList();
  }, [userLocation]);

  const getBankerList = async () => {
    if(!userLocation){
        message.warning('지역이 설정되지 않았습니다.');
        return;
    }
    try {
      const response: AxiosResponse<BankerListReturnDTO[]> = await bankerService.getBankerList(userLocation);   

      if (response && response.data) {
        if(exceptBankerId){
            console.log("list",response.data)
        setBankers(response.data.filter(banker=>banker.bankerId!=exceptBankerId));
            
        }
      } else {

        console.error('Error fetching data: response.data is undefined');
      }
    } catch (err) {
      console.error('Error fetching data:', err);

    }
  }

    return (
        <Row gutter={16}>
            {bankers.map(banker => (
                <Col span={8} key={banker.bankerName}>
                    <Card className="rounded-2xl border border-[#d3d3d3]" bodyStyle={{ padding: 0 }}>
                        <Row>
                            <img src={banker.filePath||bankerImg} alt="Specialist" className="w-full h-32 object-cover mb-5 rounded-t-2xl" />
                        </Row>
                        <Row className='min-h-64'>
                            <Col span={24} className="px-5">
                                <Row justify="space-between" align="middle" className="mb-2.5">
                                    <Title level={4} >{banker.bankerName}</Title>
                                </Row>
                                <div className="mb-2.5">
                                    {banker.specializations.map(hashTag => (
                                        <Button
                                            key={hashTag.id}
                                            type="primary"
                                            ghost
                                            className="mr-2 mb-2 bg-[#F7FDFD] text-xs p-2.5"
                                        >
                                            {hashTag.name}
                                        </Button>
                                    ))}
                                </div>
                                <hr />
                                <div className="my-5 text-base font-light">{banker.content}</div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}

export default BankerCard;