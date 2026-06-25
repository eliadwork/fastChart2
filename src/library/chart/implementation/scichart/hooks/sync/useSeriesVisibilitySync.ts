import { useEffect } from 'react';
import { SciChartSurface } from 'scichart';

export function useSeriesVisibilitySync(
  surface: SciChartSurface | undefined,
  seriesVisibility: boolean[]
) {
  useEffect(() => {
    if (!surface) return;
    const series = surface.renderableSeries.asArray();
    const mainCount = seriesVisibility.length;

    for (let index = 0; index < mainCount && index < series.length; index++) {
      series[index].isVisible = seriesVisibility[index];
    }

    // Mirror series (index mainCount) follows series[0] visibility.
    if (series.length > mainCount) {
      series[mainCount].isVisible = seriesVisibility[0] ?? true;
    }

    surface.invalidateElement();
  }, [surface, seriesVisibility]);
}
