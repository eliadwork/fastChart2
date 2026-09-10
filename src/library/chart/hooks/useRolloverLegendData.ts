import { useCallback, useMemo, useState } from 'react';

import type { ChartHoverPayload } from '../implementation/scichart/modifiers/MouseHoverModifier';
import { getInterpolatedPointAtX } from '../utils/chartDataLookup';
import type { ChartData } from '../types';

type HoverEvent = MouseEvent & Partial<ChartHoverPayload>;

/** Cursor state split by coordinate space. */
type CursorState = {
  /** Data-space coords — units of the chart axes. Used for interpolation and display. */
  data: { x: number; y: number };
  /** Viewport coordinates in CSS pixels, used for tooltip positioning. */
  client: { x: number; y: number };
};

const formatValue = (value: number): string =>
  parseFloat(value.toPrecision(4)).toString();

export interface CursorTooltipData {
  clientX: number;
  clientY: number;
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
        client: { x: event.clientX, y: event.clientY },
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
      clientX: cursor.client.x,
      clientY: cursor.client.y,
      formattedX: formatValue(cursor.data.x),
      formattedY: formatValue(cursor.data.y),
    };
  }, [cursor]);

  return { onHover, formattedHoveredValues, cursorTooltipData };
};
