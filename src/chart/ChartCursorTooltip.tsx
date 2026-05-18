import type { CursorTooltipData } from './hooks/useRolloverLegendData';
import { ChartCursorTooltipRoot } from './ChartCursorTooltipStyled';

const TOOLTIP_OFFSET_X = 14;
const TOOLTIP_OFFSET_Y = 28;

interface ChartCursorTooltipProps {
  data: CursorTooltipData;
}

export const ChartCursorTooltip = ({ data }: ChartCursorTooltipProps) => (
  <ChartCursorTooltipRoot
    style={{
      left: data.canvasX + TOOLTIP_OFFSET_X,
      top: data.canvasY - TOOLTIP_OFFSET_Y,
    }}
  >
    ({data.formattedX}, {data.formattedY})
  </ChartCursorTooltipRoot>
);
