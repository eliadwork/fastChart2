import { FastLineRenderableSeries, NumericAxis, SciChartSurface, XyDataSeries } from 'scichart';
import { useMemo } from 'react';

import { dashToStrokeArray } from '../../convert';
import { createSciChartModifiers } from '../internal/sciChartModifierFactory';
import { applyVisibleRangeLimits } from '../internal/sciChartRangeLimits';
import { addZeroLineAnnotations } from '../internal/sciChartZeroLines';
import type { ResolvedSciChartDefinition, SciChartDataBounds } from '../../scichartOptions';

export interface UseSciChartSecondPanelFlowOptions {
  definition: ResolvedSciChartDefinition;
  dataBounds: SciChartDataBounds;
}

export const useSciChartSecondPanelFlow = ({
  definition,
  dataBounds,
}: UseSciChartSecondPanelFlowOptions) => {
  return useMemo(
    () => async (rootElement: HTMLDivElement | string) => {
      const element =
        typeof rootElement === 'string'
          ? document.querySelector<HTMLDivElement>(rootElement)
          : rootElement;
      if (!element) throw new Error('SciChart second panel root element not found');

      const { sciChartSurface, wasmContext } = await SciChartSurface.create(element, {
        background: definition.styles.backgroundColor,
      });

      const axisOptions = { labelStyle: { color: definition.styles.textColor } };
      sciChartSurface.xAxes.add(new NumericAxis(wasmContext, axisOptions));
      sciChartSurface.yAxes.add(new NumericAxis(wasmContext, axisOptions));

      const firstSeries = definition.data.series[0];
      if (firstSeries) {
        const dataSeries = new XyDataSeries(wasmContext, {
          xValues: firstSeries.x,
          yValues: firstSeries.y,
          isSorted: true,
          containsNaN: false,
          dataSeriesName: firstSeries.name,
        });

        sciChartSurface.renderableSeries.add(
          new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: firstSeries.style.color,
            strokeThickness: firstSeries.style.thickness,
            strokeDashArray: dashToStrokeArray(firstSeries.style.dash),
            resamplingMode: definition.options.resampling.resamplingMode,
            resamplingPrecision: definition.options.resampling.resamplingPrecision,
            isVisible: definition.data.seriesVisibility[0] ?? true,
          })
        );
      }

      applyVisibleRangeLimits(sciChartSurface, dataBounds, definition.options.clipZoomToData);
      addZeroLineAnnotations(sciChartSurface, definition.styles.zeroLineColor);

      for (const modifier of createSciChartModifiers({ interactionOptions: definition.options })) {
        sciChartSurface.chartModifiers.add(modifier);
      }

      return { sciChartSurface };
    },
    [definition, dataBounds]
  );
};
