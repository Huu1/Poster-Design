import * as React from "react";

import { InputNumber } from "antd";
import {
  InstagramOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  VideoCameraOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";

import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { getStageState, setBoardSize } from "@/store/feature/stage";

export type sideProps = {
  style: React.CSSProperties;
};

const recommendSizeList = [
  {
    title: "朋友圈-封面",
    icon: <WechatOutlined />,
    size: { width: 1242, height: 1242 },
  },
  {
    title: "朋友圈-海报",
    icon: <WechatOutlined />,
    size: { width: 1242, height: 2208 },
  },
  {
    title: "QQ空间-背景",
    icon: <QqOutlined />,
    size: { width: 600, height: 480 },
  },
  {
    title: "朋友圈-长图",
    icon: <WechatOutlined />,
    size: { width: 800, height: 2000 },
  },
  {
    title: "微信-头像",
    icon: <WechatOutlined />,
    size: { width: 360, height: 200 },
  },
  {
    title: "Instagram Post",
    icon: <InstagramOutlined />,
    size: { width: 1080, height: 1080 },
  },
  {
    title: "Instagram Story",
    icon: <InstagramOutlined />,
    size: { width: 1080, height: 1920 },
  },
  {
    title: "Facebook Post",
    icon: <FacebookOutlined />,
    size: { width: 940, height: 788 },
  },
  {
    title: "Youtube Channel",
    icon: <YoutubeOutlined />,
    size: { width: 2560, height: 1440 },
  },
  {
    title: "Full HD",
    icon: <VideoCameraOutlined />,
    size: { width: 1920, height: 1080 },
  },
];

const BoardSize = ({ style }: sideProps) => {
  const { boardSize } = useSelector(getStageState);

  const dispatch = useDispatch();

  const onChange = (type: string, val: number) => {
    const size = {
      width: type === "width" ? val : boardSize.width,
      height: type === "height" ? val : boardSize.height,
    };
    dispatch(setBoardSize(size));
  };

  const handleClick = (size: { height: number; width: number }) => {
    dispatch(setBoardSize(size));
  };
  return (
    <div style={style}>
      <div>
        宽：
        <InputNumber
          min={10}
          value={boardSize.width}
          onChange={(val) => onChange("width", val)}
        />
      </div>
      <div>
        高：
        <InputNumber
          min={10}
          value={boardSize.height}
          onChange={(val) => onChange("height", val)}
        />
      </div>
      <div className="recommend-size-container">
        {recommendSizeList.map((item, index: number) => {
          return (
            <button
              key={index}
              onClick={() => handleClick(item.size)}
              className="recommend-size-item cursor-pointer flex justify-between items-center	"
            >
              <div className="flex justify-between items-center ">
                {item.icon}
                <div className="ml-1.5 title">{item.title}</div>
              </div>
              <span className="text-xs">{`${item.size.width} x ${item.size.height} px`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default BoardSize;
