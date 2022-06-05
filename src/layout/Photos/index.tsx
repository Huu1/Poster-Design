import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import axios from "axios";
import "./index.css";
import { sideProps } from "../BoardSize";
import { getStageState } from "@/store/feature/stage";
import { useSelector } from "react-redux";
import { EventType } from "@/views/Dashboard/type";
import { getUnsplashImage } from "@/services";

export const splitCode = "*&***&*";

const Photos = ({ style }: sideProps) => {
  const { eventBus } = useSelector(getStageState);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    getUnsplashImage()
      .then((res: any) => {
        if (res.status === 200) {
          setData((data) => {
            return [...data, ...res.data];
          });
          setLoading(false);
        } else {
          message.error("图片加载失败");
        }
      })
      .catch((error) => {
        message.error(error.toString());
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const onDragStart = (
    e: React.DragEvent<HTMLImageElement>,
    url: string,
    item: any
  ) => {
    const { width, height } = item;

    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        height: Math.round((1080 * height) / width),
        url,
      })
    );
  };

  const onClickHandle = (img: any) => {
    eventBus.emit(EventType.photo, img);
  };
  return (
    <div className="h-full" style={{ ...style }}>
      <div
        className="text-center"
        style={{ height: "40px", lineHeight: "25px" }}
      >
        Photos by Unsplash
      </div>
      <div
        id="scrollableDiv"
        className="flex-1"
        style={{
          ...style,
          height: "calc(100% - 40px)",
          overflow: "hidden auto",
        }}
      >
        <InfiniteScroll
          loader={<Spin />}
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < 300}
          scrollableTarget="scrollableDiv"
        >
          <Masonry
            breakpointCols={2}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {data.map((item, index) => {
              return (
                <div
                  key={index}
                  className="item select-none"
                  onClick={() => onClickHandle(item)}
                >
                  <img
                    src={item.urls.small}
                    alt=""
                    draggable
                    onDragStart={(e) => onDragStart(e, item.urls.regular, item)}
                  />
                  <div className="info text-center">
                    Photo by <span>{item.user.name}</span> on
                    <span>Unsplash</span>
                  </div>
                </div>
              );
            })}
          </Masonry>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Photos;
