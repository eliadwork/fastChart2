import LayersIcon from '@mui/icons-material/Layers';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import {
  DETECT_TOOLTIP_HIDE_SHAPES_FOR_HIDDEN,
  DETECT_TOOLTIP_SHOW_SHAPES_FOR_HIDDEN,
} from '../detectConstants';
import { ChartToolbarButton } from '../../../chart/ChartToolbarButton';

export interface ShapesVisibilityToolbarButtonProps {
  textColor: string;
  showShapesForHiddenSeries: boolean;
  onToggle: () => void;
}

export const ShapesVisibilityToolbarButton = ({
  textColor,
  showShapesForHiddenSeries,
  onToggle,
}: ShapesVisibilityToolbarButtonProps) => (
  <ChartToolbarButton
    tooltip={
      showShapesForHiddenSeries
        ? DETECT_TOOLTIP_HIDE_SHAPES_FOR_HIDDEN
        : DETECT_TOOLTIP_SHOW_SHAPES_FOR_HIDDEN
    }
    textColor={textColor}
    onClick={onToggle}
  >
    {showShapesForHiddenSeries ? <LayersIcon /> : <LayersClearIcon />}
  </ChartToolbarButton>
);
