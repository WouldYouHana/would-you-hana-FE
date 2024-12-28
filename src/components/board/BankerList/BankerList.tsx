import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BankerListReturnDTO } from '../../../types/dto/banker.dto';
import { useSelector } from 'react-redux';
import { RootState } from '../../../hoc/store';
import { AxiosResponse } from 'axios';
import { bankerService } from '../../../services/banker.service';

import bankerImg from '../../../assets/img/banker1.png';


const BankerList: React.FC = () => {
  const [bankers, setBankers] = useState<BankerListReturnDTO[]>([]);
  const { userLocation } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    getBankerList();
  }, [userLocation]);

  const getBankerList = async () => {
    if (!userLocation) {
      message.warning('지역이 설정되지 않았습니다.');
      return;
    }
    try {
      const response: AxiosResponse<BankerListReturnDTO[]> = await bankerService.getBankerList(userLocation);

      if (response && response.data) {

        setBankers(response.data);

        console.log("banker",bankers)
      } else {

        console.error('Error fetching data: response.data is undefined');
      }
    } catch (err) {
      console.error('Error fetching data:', err);

    }
  }

  return (
    <div className="border border-[#CFCFCF40] rounded p-5">
      <p className="text-lg mb-5">저희에게 무엇이든 물어보세요!</p>
      <ul className="space-y-5">
        {bankers.map((banker) => (
          <li key={banker.bankerId}>
            <div
              className="flex flex-col cursor-pointer hover:bg-gray-50 transition-colors rounded p-2"
              onClick={() => navigate(`/bankerProfile/${banker.bankerId}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 overflow-hidden">
                  <img
                    src={banker.filePath||bankerImg}
                    className="h-full w-auto rounded-full object-cover object-[15%]"
                  />
                </div>
                <div>
                  <p className="font-normal">
                    {banker.bankerName}
                  </p>
                  <p className="font-normal text-[#7E8082] text-sm">
                    {banker.content.length > 57
                      ? `${banker.content.slice(0, 57)}...`
                      : banker.content}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BankerList; 