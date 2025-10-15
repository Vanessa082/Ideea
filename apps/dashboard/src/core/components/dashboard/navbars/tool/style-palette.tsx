"use client";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Slider } from "@/core/components/ui/slider";
import { useCanvas } from "@/core/hook/canvas-context";
import { ElementStyle } from "@/core/types/canvas";

export function StylePalette({ selectedId }: { selectedId?: string | null }) {
  const { elements, updateElement, defaultStyle, setDefaultStyle } = useCanvas();

  const element = selectedId ? elements.find((el) => el.id === selectedId) : null;

  const style: ElementStyle = {
    fill: element?.style.fill ?? defaultStyle.fill,
    stroke: element?.style.stroke ?? defaultStyle.stroke,
    strokeWidth: element?.style.strokeWidth ?? defaultStyle.strokeWidth,
    dash: element?.style.dash ?? defaultStyle.dash,
    opacity: element?.style.opacity ?? defaultStyle.opacity,
    fontSize: element?.style.fontSize ?? defaultStyle.fontSize ?? 16,
    fontFamily: element?.style.fontFamily ?? defaultStyle.fontFamily ?? "Arial",
  };

  const updateStyle = (s: Partial<ElementStyle>) => {
    if (element) {
      updateElement(element.id, { style: { ...style, ...s } });
    } else {
      setDefaultStyle({ ...style, ...s });
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-2xl p-3 flex gap-3 items-center z-50">
      {/* Fill */}
      <div className="flex flex-col items-center">
        <label className="text-xs">Fill</label>
        <Input
          type="color"
          value={style.fill}
          onChange={(e) => updateStyle({ fill: e.target.value })}
          className="w-10 h-10 p-1"
        />
      </div>

      {/* Stroke */}
      <div className="flex flex-col items-center">
        <label className="text-xs">Stroke</label>
        <Input
          type="color"
          value={style.stroke}
          onChange={(e) => updateStyle({ stroke: e.target.value })}
          className="w-10 h-10 p-1"
        />
      </div>

      {/* Stroke width */}
      <div className="flex flex-col w-24">
        <label className="text-xs">Width</label>
        <Slider
          value={[style.strokeWidth]}
          min={1}
          max={20}
          step={1}
          onValueChange={(val) => updateStyle({ strokeWidth: val[0] })}
        />
      </div>

      {/* Dash / Solid */}
      <Button
        variant={style.dash.length ? "default" : "outline"}
        onClick={() => updateStyle({ dash: style.dash.length ? [] : [6, 4] })}
      >
        {style.dash.length ? "Dashed" : "Solid"}
      </Button>

      {/* Font size (text only) */}
      {element?.type === "text" && (
        <div className="flex flex-col w-24">
          <label className="text-xs">Font</label>
          <Slider
            value={[style.fontSize]}
            min={8}
            max={48}
            step={1}
            onValueChange={(val) => updateStyle({ fontSize: val[0] })}
          />
        </div>
      )}
    </div>
  );
}
