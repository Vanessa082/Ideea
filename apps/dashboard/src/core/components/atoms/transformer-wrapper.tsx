import React, { useRef, useEffect } from "react";
import { Transformer } from "react-konva";
import Konva from "konva";
import { CanvasElement } from "@/core/types/canvas";

interface TransformerWrapperProps {
  selectedId: string | null;
  onTransformEnd: (e: Konva.KonvaEventObject<any>) => void;
  elements: CanvasElement[];
}

const TransformerWrapper: React.FC<TransformerWrapperProps> = ({
  selectedId,
  onTransformEnd,
  elements,
}) => {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (selectedId && trRef.current) {
      const stage = trRef.current.getStage();
      if (!stage) return;

      const node = stage.findOne(`#${selectedId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer()?.batchDraw();
      } else {
        trRef.current.nodes([]);
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedId, elements]);

  return (
    <Transformer
      ref={trRef}
      onTransformEnd={onTransformEnd}
      rotateEnabled={true}
      enabledAnchors={[
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "middle-left",
        "middle-right",
      ]}
      boundBoxFunc={(oldBox, newBox) => {
        // Prevent collapsing to invisible size
        if (newBox.width < 10 || newBox.height < 10) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};

export default TransformerWrapper;
