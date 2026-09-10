import { useMemo } from 'react';

import { Legend } from '../Legend/Legend';
import type { ResolvedLegendProps } from '../resolvers/resolveLegendProps';

export interface UseChartLegendSlotParams {
  legendProps: ResolvedLegendProps | null;
  hoveredSeriesValues?: (string | null)[] | null;
}

export const useChartLegendSlot = ({
  legendProps,
  hoveredSeriesValues,
}: UseChartLegendSlotParams): React.ReactNode => {
  return useMemo(() => {
    if (legendProps == null) {
      return null;
    }

    return (
      <Legend
        backgroundColor={legendProps.backgroundColor}
        textColor={legendProps.textColor}
        series={legendProps.series}
        seriesVisibility={legendProps.seriesVisibility}
        seriesGroupKeys={legendProps.seriesGroupKeys}
        hoveredSeriesValues={hoveredSeriesValues}
        onSeriesVisibilityChange={legendProps.onSeriesVisibilityChange}
        onSeriesVisibilityGroupChange={legendProps.onSeriesVisibilityGroupChange}
      />
    );
  }, [legendProps, hoveredSeriesValues]);
};
