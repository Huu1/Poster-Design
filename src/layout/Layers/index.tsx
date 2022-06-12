import React, { useContext } from "react";
import { List, arrayMove } from "react-movable";

import "./index.css";
import { sideProps } from "../BoardSize";
import { Input } from "antd";
import IconFont from "@/components/Iconfont";
import { AppCtx, Atype } from "@/reducer";

// export const splitCode = '*&***&*';

const iconStyle = { color: "#abb3bf", fontSize: "16px" };

const HandleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 22 22"
    fill="none"
    stroke="#abb3bf"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-move"
  >
    <polyline points="5 9 2 12 5 15" />
    <polyline points="9 5 12 2 15 5" />
    <polyline points="15 19 12 22 9 19" />
    <polyline points="19 9 22 12 19 15" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="12" y1="2" x2="12" y2="22" />
  </svg>
);

export const buttonStyles = {
  border: "none",
  margin: 0,
  padding: 0,
  width: "auto",
  overflow: "visible",
  cursor: "pointer",
  height: "28px",
  marginRight: "10px",
};

const Layers = ({ style }: sideProps) => {
  const { state, dispatch } = useContext(AppCtx)!;
  const { shapeElements, selectedId } = state;

  const setShapeProps = (
    index: number,
    props: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // e.stopPropagation();
    const result = shapeElements.slice();
    result[index][props] = !result[index][props];
    dispatch({
      type: Atype.shapeElements,
      payload: result,
    });
  };
  const deleteElement = (id: string) => {
    const result = shapeElements.slice().filter((i) => i.id !== id);
    dispatch({
      type: Atype.shapeElements,
      payload: result,
    });
    dispatch({
      type: Atype.selectedId,
      payload: undefined,
    });
  };

  return (
    <div className="" style={{ ...style }}>
      <div>
        <List
          values={shapeElements}
          onChange={({ oldIndex, newIndex }: any) =>
            dispatch({
              type: Atype.shapeElements,
              payload: arrayMove(shapeElements, oldIndex, newIndex),
            })
          }
          renderList={({ children, props }: any) => (
            <ul {...props}>{children}</ul>
          )}
          renderItem={({ value, props, isDragged, isSelected, index }: any) => (
            <li
              onClick={() =>
                dispatch({
                  type: Atype.selectedId,
                  payload: value.id,
                })
              }
              {...props}
              style={{
                ...props.style,
                padding: "4px",
                margin: "0.3em 0em",
                listStyleType: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow:
                  " 0 0 0 1px rgb(17 20 24 / 40%), 0 0 0 rgb(17 20 24 / 0%), 0 0 0 rgb(17 20 24 / 0%)",
                borderRadius: "3px",
                cursor: isDragged ? "grabbing" : "inherit",
                fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                backgroundColor:
                  isDragged || isSelected
                    ? "rgba(0, 161, 255, 0.2)"
                    : "#383e47",
              }}
              className={`${
                value.id.toString() === selectedId ? "layer-selected" : ""
              }`}
            >
              <div className="flex items-center	" style={{ width: "60px" }}>
                <button
                  data-movable-handle
                  style={{
                    ...buttonStyles,
                    cursor: isDragged ? "grabbing" : "grab",
                  }}
                  tabIndex={-1}
                >
                  <HandleIcon />
                </button>
                <span style={{ color: "#abb3bf" }}>{value.type}</span>
              </div>

              <div className="layer-input px-3 ">
                <input
                  className="w-36"
                  placeholder="输入元素名称"
                  value={value.name || `未命名${value.type}`}
                  disabled
                />
              </div>

              <div className="ml-auto	flex">
                <div
                  onClick={(e) => setShapeProps(index as number, "visible", e)}
                >
                  <IconFont
                    type={value.visible ? "icon-yanjing" : "icon-bukejian"}
                    style={iconStyle}
                  />
                </div>
                <div
                  className="mx-4	"
                  title="锁定位置"
                  onClick={(e) =>
                    setShapeProps(index as number, "draggable", e)
                  }
                >
                  <IconFont
                    type={value.draggable ? "icon-jiesuo" : "icon-suoding"}
                    style={iconStyle}
                  />
                </div>
                <div
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteElement(value.id);
                  }}
                >
                  <IconFont type="icon-shanchu" style={iconStyle} />
                </div>
              </div>
            </li>
          )}
        />
      </div>
    </div>
  );
};

export default Layers;
