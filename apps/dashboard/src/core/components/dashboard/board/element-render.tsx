import { useBoardStore } from "../../../../../store/board-store";
import { Line, Rect, Circle, Text, Arrow } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { CanvasElement } from "../../../types/board.types";

interface ElementRendererProps {
  onElementClick: (e: KonvaEventObject<MouseEvent>) => void;
  onElementDragEnd: (element: CanvasElement) => void;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ onElementClick, onElementDragEnd }) => {
  const { elements, updateElement } = useBoardStore();

  console.log('ElementRenderer - rendering elements count:', elements.length);
  console.log('First few elements:', elements.slice(0, 3));

  // Debug: Check for any invalid elements that might cause Konva errors
  elements.forEach((element, index) => {
    if (element && typeof element === 'object') {
      if (!element.id || !element.type) {
        console.error('Invalid element at index', index, ':', element);
      }
      if (element.type === 'line' && (!Array.isArray(element.points) || element.points.length < 4)) {
        console.error('Invalid line element at index', index, ':', element);
      }
    } else {
      console.error('Non-object element at index', index, ':', element);
    }
  });

  // Filter and validate elements before rendering
  const validElements = elements.filter(element => {
    if (!element || !element.type || !element.id) {
      console.warn('Invalid element (missing type or id):', element);
      return false;
    }

    // Additional validation per type
    switch (element.type) {
      case 'line':
        if (!Array.isArray(element.points) || element.points.length < 4) {
          console.warn('Invalid line element (insufficient points):', element);
          return false;
        }
        return true;
      case 'rectangle':
      case 'circle':
        if (typeof element.x !== 'number' || typeof element.y !== 'number' ||
            typeof element.width !== 'number' || typeof element.height !== 'number') {
          console.warn(`Invalid ${element.type} element (missing dimensions):`, element);
          return false;
        }
        // Don't render shapes with zero or negative dimensions
        if (Math.abs(element.width) < 1 || Math.abs(element.height) < 1) {
          return false;
        }
        return true;
      case 'text':
        if (typeof element.x !== 'number' || typeof element.y !== 'number' ||
            typeof element.text !== 'string') {
          console.warn('Invalid text element:', element);
          return false;
        }
        return true;
      case 'arrow':
        if (!Array.isArray(element.points) || element.points.length < 4) {
          console.warn('Invalid arrow element (insufficient points):', element);
          return false;
        }
        return true;
      default:
        console.warn('Unknown element type:', element.type);
        return false;
    }
  });

  console.log('Valid elements count:', validElements.length);

  // Filter out any elements that would cause rendering issues
  const renderableElements = validElements.filter(element => {
    if (element.type === 'line') {
      const points = Array.isArray(element.points) ? element.points.filter(p => typeof p === 'number') : [];
      return points.length >= 4;
    }
    return true;
  });

  return (
    <>
      {renderableElements.map((element) => {
        try {
          switch (element.type) {
            case "line":
              // Points are already validated above
              const points = Array.isArray(element.points) ? element.points.filter(p => typeof p === 'number') : [];
              return (
                <Line
                  key={element.id}
                  id={element.id}
                  points={points}
                  stroke={element.color || '#000000'}
                  strokeWidth={element.strokeWidth || 5}
                  lineCap="round"
                  tension={0.5}
                  bezier={true}
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
                  width={Math.abs(element.width ?? 0)}
                  height={Math.abs(element.height ?? 0)}
                  fill={element.color || '#000000'}
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
                  radius={Math.abs(element.width as number)}
                  fill={element.color || '#000000'}
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
                  text={element.text || ''}
                  fill={element.color || '#000000'}
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
            case "arrow":
              // Points are already validated above
              const arrowPoints = Array.isArray(element.points) ? element.points.filter(p => typeof p === 'number') : [];
              return (
                <Arrow
                  key={element.id}
                  id={element.id}
                  points={arrowPoints}
                  stroke={element.color || '#000000'}
                  strokeWidth={element.strokeWidth || 5}
                  fill={element.color || '#000000'}
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
        } catch (error) {
          console.error('Error rendering element:', element, error);
          return null;
        }
      })}
    </>
  );
};