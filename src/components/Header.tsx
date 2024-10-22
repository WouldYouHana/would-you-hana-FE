import { Link } from "react-router-dom"; // Import necessary routing components
import { useState } from "react";
import logo from "../assets/logo.png";
import userIcon from "../assets/icon_user.png";

import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

const items: MenuProps["items"] = [
  {
    label: "서울시 성동구",
    key: "0",
  },
  {
    label: "서울시 동작구",
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: <a href="/location">내 동네 설정</a>,
    key: "3",
  },
];
function Header() {
  const [label, setLabel] = useState<string>("내 동네 설정");

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const selectedItem = items?.find((item) => item?.key === e.key);
    if (selectedItem && "label" in selectedItem) {
      setLabel(selectedItem.label as string);
    }
  };

  const menu: MenuProps = {
    items: items?.map((item) => ({
      ...item,
      onClick: item && "label" in item ? handleMenuClick : undefined,
    })),
  };
  return (
    <div className="w-screen px-6 py-3 flex items-center bg-white border-b">
      <Link to="/">
        <img src={logo} alt="logo" width={130} />
      </Link>

      <div className="w-full flex justify-between font-extrabold">
        <nav className="flex items-center ">
          <ul className="flex gap-8 items-center ">
            <li>
              <Link to="/qna">Q&A</Link>
            </li>
            <li>
              <Link to="/hana">우주하나</Link>
            </li>
          </ul>
        </nav>
        <div>
          <ul className="flex gap-8 items-center ">
            <li>
              <Dropdown menu={menu}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {label}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </li>
            <li>
              <Link to="/my/profile">마이페이지</Link>
            </li>
            <li>
              <span>로그아웃</span>
            </li>
            <li className="flex items-center gap-2">
              <img src={userIcon} alt="user icon" width={35} />
              <span>김하나</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;