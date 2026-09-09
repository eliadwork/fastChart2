import { createPortal } from 'react-dom';
import type { CursorTooltipData } from './hooks/useRolloverLegendData';
import { ChartCursorTooltipRoot } from './ChartCursorTooltipStyled';

const TOOLTIP_OFFSET_X = 10;
const TOOLTIP_OFFSET_Y = 10;

interface ChartCursorTooltipProps {
  data: CursorTooltipData;
}

export const ChartCursorTooltip = ({ data }: ChartCursorTooltipProps) => createPortal(
  <ChartCursorTooltipRoot
    style={{
      left: data.clientX + TOOLTIP_OFFSET_X,
      top: data.clientY + TOOLTIP_OFFSET_Y,
    }}
  >
    ({data.formattedX}, {data.formattedY})
  </ChartCursorTooltipRoot>,
  document.body
);
