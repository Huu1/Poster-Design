import React, { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Image, KonvaNodeComponent, Rect, Transformer } from "react-konva";
import useImage from "use-image";
import { useSelector } from "react-redux";
import { getStageState } from "@/store/feature/stage";
import { TOffset, TScale } from "@/views/Dashboard/type";

function getCrop(image: any, size: { width: number; height: number }) {
  const width = size.width;
  const height = size.height;
  const aspectRatio = width / height;

  let newWidth;
  let newHeight;

  const imageRatio = image.width / image.height;

  if (aspectRatio >= imageRatio) {
    newWidth = image.width;
    newHeight = image.width / aspectRatio;
  } else {
    newWidth = image.height * aspectRatio;
    newHeight = image.height;
  }

  const x = 0;
  const y = 0;
  // if (clipPosition === "left-top") {
  //   x = 0;
  //   y = 0;
  // }

  return {
    cropX: x,
    cropY: y,
    cropWidth: newWidth,
    cropHeight: newHeight,
  };
}

const Photo = ({
  shapeProps,
  scale,
  isSelected,
  onSelect,
  onChange,
}: {
  shapeProps: Konva.ImageConfig;
  scale: TScale;
  isSelected: boolean;
  onSelect: (node?: Konva.Node) => void;
  onChange: (elementConfig: Konva.ImageConfig) => void;
}) => {
  const [image, status] = useImage(shapeProps.src);
  const shapeRef = useRef<Konva.Image>();
  const imgLoadedRef = useRef<Konva.Rect>();
  const trBoarderRef = useRef<Konva.Transformer>();
  const [hoverFlag, setHoverFlag] = useState(false);

  useEffect(() => {
    if (isSelected) {
      onSelect?.(shapeRef.current);
    }
  }, [isSelected]);

  function applyCrop(newSize: any) {
    const img = shapeRef.current as Konva.Image;
    const crop = getCrop(img.image(), newSize);
    return crop;
  }

  const onMouseOver = () => {
    if (isSelected && shapeProps.draggable) return;
    setHoverFlag(true);
    trBoarderRef.current?.nodes([shapeRef.current as any]);
    trBoarderRef.current?.getLayer()?.batchDraw();
  };

  const getNewSize = () => {
    const node = shapeRef.current as Konva.Image;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const width = (node.width() * scaleX) / scale.x;
    const height = (node.height() * scaleY) / scale.y;
    return {
      width,
      height,
    };
  };

  if (status === "loading") {
    return (
      <>
        <Rect
          {...shapeProps}
          fill={"skyblue"}
          opacity={0.8}
          scale={scale}
          ref={imgLoadedRef as React.LegacyRef<Konva.Rect>}
          offsetX={(shapeProps?.width as number) / 2}
          offsetY={(shapeProps?.height as number) / 2}
          draggable={false}
          stroke="#6495ED"
          strokeWidth={3}
        />
      </>
    );
  }

  return (
    <>
      <Image
        {...shapeProps}
        ref={shapeRef as React.LegacyRef<Konva.Image>}
        offsetX={image ? (shapeProps.width as number) / 2 : 0} // I will use offset to set origin to the center of the image
        offsetY={image ? (shapeProps.height as number) / 2 : 0}
        scale={scale}
        image={image}
        onClick={() => onSelect()}
        onTap={() => onSelect()}
        onMouseDown={() => onSelect()}
        onMouseOver={onMouseOver}
        onMouseOut={() => {
          setHoverFlag(false);
        }}
        lastCropUsed={shapeProps.lastCropUsed}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={() => {
          onChange({
            ...shapeProps,
            ...applyCrop(getNewSize()),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current as Konva.Image;
          const newWH = getNewSize();
          node.scale(scale);

          onChange({
            ...shapeProps,
            ...newWH,
            x: node.x(),
            y: node.y(),
          });
        }}
      />
      {hoverFlag && (
        <Transformer
          ref={trBoarderRef as React.LegacyRef<Konva.Transformer>}
          enabledAnchors={[]}
          rotateEnabled={false}
          borderStrokeWidth={3}
        />
      )}
    </>
  );
};
export default Photo;
