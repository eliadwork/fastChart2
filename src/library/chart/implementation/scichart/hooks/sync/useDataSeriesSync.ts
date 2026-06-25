import { useEffect } from 'react';
import { SciChartSurface } from 'scichart';

import type {
  ResolvedSciChartData,
  ResolvedSciChartResamplingOption,
  SciChartDataBounds,
} from '../../scichartOptions';
import { applyVisibleRangeLimits } from '../internal/sciChartRangeLimits';
import { clearRenderableSeries, rebuildRenderableSeries } from '../internal/sciChartSeriesRuntime';

export interface UseDataSeriesSyncOptions {
  surface?: SciChartSurface;
  data: ResolvedSciChartData;
  dataBounds: SciChartDataBounds;
  clipZoomToData: boolean;
  seriesConfig: ResolvedSciChartResamplingOption;
  seriesVisibility: boolean[];
  secondYAxisId?: string;
}

export const useDataSeriesSync = ({
  surface,
  data,
  dataBounds,
  clipZoomToData,
  seriesConfig,
  seriesVisibility,
  secondYAxisId,
}: UseDataSeriesSyncOptions) => {
  useEffect(() => {
    if (!surface) return;

    // Keep runtime sync deterministic: on any series-shape change, rebuild renderable series
    // from current converted data while preserving the existing surface/axes/viewport.
    if (data.series.length === 0) {
      clearRenderableSeries(surface);
      applyVisibleRangeLimits(surface, dataBounds, clipZoomToData);
      surface.invalidateElement();
      return;
    }

    rebuildRenderableSeries({
      surface,
      data,
      seriesConfig,
      secondYAxisId,
    });

    applyVisibleRangeLimits(surface, dataBounds, clipZoomToData);
    surface.invalidateElement();
  }, [surface, data, dataBounds, clipZoomToData, seriesConfig, seriesVisibility, secondYAxisId]);
};
