import React, { useRef, useState } from "react";
import IconFont from "@/components/Iconfont";
// import BoardSize from "./BoardSize";

import "./index.css";
import Toggle from "./toggle";
// import Layers from "./Layers";
// import Photos from "./Photos";
// import Texts from "./Texts";

const LEFT_WIDTH = 60;
const LEFT_EXTEND_WIDTH = 350;

enum enumMenu {
  background = "background",
  size = "size",
  photo = "photo",
  text = "text",
  layer = "layer",
}

const sideMemu = [
  { title: "文字", icon: "icon-wenzi", value: enumMenu.text },
  { title: "照片", icon: "icon-tupian", value: enumMenu.photo },
  { title: "背景", icon: "icon-caidan", value: enumMenu.background },
  { title: "图层", icon: "icon-layers", value: enumMenu.layer },
  { title: "尺寸", icon: "icon-resize_", value: enumMenu.size },
];

const Sidebar = () => {
  const [checked, setChecked] = useState<unknown>(enumMenu.photo);
  const ref = useRef<any>();

  const toggle = (val?: any) => {
    if (val) {
      ref.current.style.width = `${LEFT_EXTEND_WIDTH + LEFT_WIDTH}px`;
    } else {
      ref.current.style.width = `${LEFT_WIDTH}px`;
    }
    setChecked(val);
  };

  return (
    <div className="flex h-full bg-primary" id="memu-side-bar" ref={ref}>
      <div
        className="bg-primary flex flex-col side-left-menu"
        style={{ width: `${LEFT_WIDTH}px` }}
      >
        {sideMemu.map((item) => {
          return (
            <div
              key={item.value}
              className={`flex flex-col justify-center 	items-center cursor-pointer	side-menu ${
                checked === item.value ? "side-menu-checked" : ""
              }`}
              onClick={() => toggle(item.value)}
            >
              <IconFont style={{ fontSize: "22px" }} type={item.icon} />
              <div className="mt-1.5 text-xs">{item.title}</div>
            </div>
          );
        })}
      </div>

      <div
        className="relative flex-1 cursor-pointer text-white	"
        id="side-nav"
        style={{
          display: checked ? "" : "none",
          width: `${LEFT_EXTEND_WIDTH}px`,
          padding: "10px",
        }}
      >
        {/* <BoardSize
          style={{ display: checked === enumMenu.size ? "" : "none" }}
        />

        <Photos style={{ display: checked === enumMenu.photo ? "" : "none" }} />

        <Texts style={{ display: checked === enumMenu.text ? "" : "none" }} />

        <Layers style={{ display: checked === enumMenu.layer ? "" : "none" }} /> */}

        <Toggle onClickHandle={toggle} />
      </div>
    </div>
  );
};

export default Sidebar;
