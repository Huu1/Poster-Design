import React, { useEffect, useRef } from "react";
import Konva from "konva";
import { Image, KonvaNodeComponent, Rect } from "react-konva";
import useImage from "use-image";
import { useSelector } from "react-redux";
import { getStageState } from "@/store/feature/stage";
import { TOffset, TScale } from "@/views/Dashboard/type";

// function getCrop(
//   image: any,
//   size: { width: number; height: number },
//   clipPosition = "left-top"
// ) {
//   const width = size.width;
//   const height = size.height;
//   const aspectRatio = width / height;

//   let newWidth;
//   let newHeight;

//   const imageRatio = image.width / image.height;

//   if (aspectRatio >= imageRatio) {
//     newWidth = image.width;
//     newHeight = image.width / aspectRatio;
//   } else {
//     newWidth = image.height * aspectRatio;
//     newHeight = image.height;
//   }

//   let x = 0;
//   let y = 0;
//   if (clipPosition === "left-top") {
//     x = 0;
//     y = 0;
//   }

//   return {
//     cropX: x,
//     cropY: y,
//     cropWidth: newWidth,
//     cropHeight: newHeight,
//   };
// }

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
  onChange?: (elementConfig: Konva.ImageConfig) => void;
}) => {
  const [image, status] = useImage(shapeProps.src);
  const shapeRef = useRef<Konva.Image>();
  const imgLoadedRef = useRef<Konva.Rect>();

  useEffect(() => {
    if (isSelected) {
      onSelect?.(shapeRef.current);
    }
  }, [isSelected]);

  // function applyCrop(pos: string | undefined) {
  //   const img = shapeRef.current as Konva.Image;
  //   img.setAttr("lastCropUsed", pos);
  //   const crop = getCrop(
  //     img.image(),
  //     { width: img.width(), height: img.height() },
  //     pos
  //   );
  //   img.setAttrs(crop);
  // }

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
          stroke="red"
          strokeWidth={3}
        />
      </>
    );
  }
  return (
    <Image
      {...shapeProps}
      ref={shapeRef as React.LegacyRef<Konva.Image>}
      offsetX={image ? image.width / 2 : 0} // I will use offset to set origin to the center of the image
      offsetY={image ? image.height / 2 : 0}
      scale={scale}
      image={image}
      onClick={() => onSelect()}
      onTap={() => onSelect()}
      onMouseDown={() => onSelect()}
      onDragEnd={(e) => {
        // onChange({
        //   ...shapeProps,
        //   x: e.target.x(),
        //   y: e.target.y(),
        // });
      }}
      // onTransform={() => {
      // const node = shapeRef.current as Konva.Image;
      // const scaleX = node.scaleX();
      // const scaleY = node.scaleY();
      // onChange({
      //   ...shapeProps,
      //   x: node.x(),
      //   y: node.y(),
      //   // set minimal value
      //   width: node.width() * (1 + scaleX - scale.x),
      //   height: node.height() * (1 + scaleY - scale.y),
      // });
      // applyCrop(node.getAttr("lastCropUsed"));
      // }}
    />
  );
};
export default Photo;
