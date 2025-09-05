

import { useBoardStore } from "../../../../../store/board-store";
import { Line, Rect, Circle, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { CanvasElement } from "../../../types/board.types";

interface ElementRendererProps {
  onElementClick: (e: KonvaEventObject<MouseEvent>) => void;
  onElementDragEnd: (element: CanvasElement) => void;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ onElementClick, onElementDragEnd }) => {
  const { elements, updateElement } = useBoardStore();

  return (
    <>
      {elements.map((element) => {
        switch (element.type) {
          case "line":
            return (
              <Line
                key={element.id}
                id={element.id}
                points={element.points}
                stroke={element.color}
                strokeWidth={5}
                lineCap="round"
                tension={0.5}
                onClick={onElementClick}
                draggable
                onDragEnd={(e) => {
                  const node = e.target;
                  const newElement = {
                    ...element,
                    x: node.x(),
                    y: node.y(),
                  };
                  updateElement(newElement);
                  onElementDragEnd(newElement);
                }}
              />
            );
          case "rectangle":
            return (
              <Rect
                key={element.id}
                id={element.id}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                fill={element.color}
                onClick={onElementClick}
                draggable
                onDragEnd={(e) => {
                  const node = e.target;
                  const newElement = {
                    ...element,
                    x: node.x(),
                    y: node.y(),
                  };
                  updateElement(newElement);
                  onElementDragEnd(newElement);
                }}
              />
            );
          case "circle":
            return (
              <Circle
                key={element.id}
                id={element.id}
                x={element.x}
                y={element.y}
                radius={element.width as number}
                fill={element.color}
                onClick={onElementClick}
                draggable
                onDragEnd={(e) => {
                  const node = e.target;
                  const newElement = {
                    ...element,
                    x: node.x(),
                    y: node.y(),
                  };
                  updateElement(newElement);
                  onElementDragEnd(newElement);
                }}
              />
            );
          case "text":
            return (
              <Text
                key={element.id}
                id={element.id}
                x={element.x}
                y={element.y}
                text={element.text}
                fill={element.color}
                onClick={onElementClick}
                draggable
                onDragEnd={(e) => {
                  const node = e.target;
                  const newElement = {
                    ...element,
                    x: node.x(),
                    y: node.y(),
                  };
                  updateElement(newElement);
                  onElementDragEnd(newElement);
                }}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};