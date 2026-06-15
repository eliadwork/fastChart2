import type { SciChartSurface } from 'scichart';

import type { ResolvedSciChartData, ResolvedSciChartDefinition } from './scichartOptions';
import { useIconsSync } from './hooks/sync/useIconsSync';
import { useShapesSync } from './hooks/sync/useShapesSync';
import { useSciChartDataBoundsModel } from './hooks/model/useSciChartDataBoundsModel';

interface SciChartStackedPanelEffectsProps {
  surface: SciChartSurface;
  definition: ResolvedSciChartDefinition;
  panelData: ResolvedSciChartData;
}

export const SciChartStackedPanelEffects = ({
  surface,
  definition,
  panelData,
}: SciChartStackedPanelEffectsProps) => {
  const panelBounds = useSciChartDataBoundsModel(panelData);
  useShapesSync({ surface, shapes: definition.shapes, dataBounds: panelBounds });
  useIconsSync({ surface, icons: definition.icons });
  return null;
};
