import { useCallback, useMemo, useState } from 'react';

import type { ChartHoverPayload } from '../implementation/scichart/modifiers/MouseHoverModifier';
import { getInterpolatedPointAtX } from '../../../utils/chartDataLookup';
import type { ChartData } from '../types';

type HoverEvent = MouseEvent & Partial<ChartHoverPayload>;

/** Cursor state split by coordinate space. */
type CursorState = {
  /** Data-space coords — units of the chart axes. Used for interpolation and display. */
  data: { x: number; y: number };
  /** Pixel coords relative to the canvas top-left. Used for tooltip positioning. */
  canvas: { x: number; y: number };
};

const formatValue = (value: number): string =>
  parseFloat(value.toPrecision(4)).toString();

export interface CursorTooltipData {
  canvasX: number;
  canvasY: number;
  formattedX: string;
  formattedY: string;
}

export const useRolloverLegendData = (data: ChartData) => {
  const [cursor, setCursor] = useState<CursorState | null>(null);

  const onHover = useCallback((event: MouseEvent) => {
    const e = event as HoverEvent;
    if (event.type === 'mouseleave' || !e.dataPoint) {
      setCursor(null);
    } else {
      setCursor({
        data: e.dataPoint,
        canvas: e.canvasPoint ?? { x: 0, y: 0 },
      });
    }
  }, []);

  const chartDataLike = useMemo(
    () => ({ lines: data.map((s) => ({ x: s.x, y: s.y })) }),
    [data]
  );

  const hoveredSeriesValues = useMemo<(number | null)[] | null>(() => {
    if (cursor === null) return null;
    return data.map((_, index) => {
      const point = getInterpolatedPointAtX(chartDataLike, cursor.data.x, index);
      return point?.y ?? null;
    });
  }, [chartDataLike, data, cursor]);

  const formattedHoveredValues = useMemo<(string | null)[] | null>(() => {
    if (hoveredSeriesValues === null || cursor === null) return null;
    const formattedX = formatValue(cursor.data.x);
    return hoveredSeriesValues.map((v) =>
      v !== null ? `(${formattedX}, ${formatValue(v)})` : null
    );
  }, [hoveredSeriesValues, cursor]);

  const cursorTooltipData = useMemo<CursorTooltipData | null>(() => {
    if (cursor === null) return null;
    return {
      canvasX: cursor.canvas.x,
      canvasY: cursor.canvas.y,
      formattedX: formatValue(cursor.data.x),
      formattedY: formatValue(cursor.data.y),
    };
  }, [cursor]);

  return { onHover, formattedHoveredValues, cursorTooltipData };
};
