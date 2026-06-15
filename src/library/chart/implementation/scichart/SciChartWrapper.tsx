/**
 * SciChartWrapper – single SciChart implementation component.
 * Resolves SciChart runtime definition, creates initChart, runs sync hooks, and renders SciChartReact.
 */

import type { ChartImplementationProps } from '../implementationProps';
import type { UseSciChartRuntimeSyncFlowOptions } from './hooks/flow/useSciChartRuntimeSyncFlow';

import { SciChartSurface } from 'scichart';
import { SciChartReact } from 'scichart-react';

import { SkeletonLoading } from '../../../skeletonLoader/SkeletonLoading';
import { ChartWrapperBox } from '../../Chart.style';
import { useSciChartRuntimeFlow } from './hooks/flow/useSciChartRuntimeFlow';
import { useSciChartRuntimeSyncFlow } from './hooks/flow/useSciChartRuntimeSyncFlow';
import { useSciChartOptionsModel } from './hooks/model/useSciChartOptionsModel';
import { SciChartStackedSurfaces } from './SciChartStackedSurfaces';
import { SCI_CHART_WASM_NO_SIMD_URL, SCI_CHART_WASM_URL } from './sciChartWrapperConstants';
import { SciChartContainer, SciChartSurfaceStyle } from './SciChartWrapperStyled';

SciChartSurface.configure({
  wasmUrl: SCI_CHART_WASM_URL,
  wasmNoSimdUrl: SCI_CHART_WASM_NO_SIMD_URL,
});

const SciChartRuntimeEffects = (params: UseSciChartRuntimeSyncFlowOptions) => {
  useSciChartRuntimeSyncFlow(params);
  return null;
};

export const SciChartWrapper = ({
  definition,
  containerStyle,
  overlaySlot,
  loading = false,
}: ChartImplementationProps) => {
  const sciChartDefinition = useSciChartOptionsModel({
    definition,
  });

  const stackedYAxes = sciChartDefinition.options.yAxes?.filter((a) => a.stacked) ?? [];
  const isStacked = stackedYAxes.length > 1;

  const { initChart, dataBounds } = useSciChartRuntimeFlow({
    definition: sciChartDefinition,
  });

  if (loading) {
    return (
      <ChartWrapperBox style={containerStyle}>
        <SkeletonLoading />
      </ChartWrapperBox>
    );
  }

  if (isStacked) {
    return (
      <ChartWrapperBox style={containerStyle}>
        <SciChartStackedSurfaces
          definition={sciChartDefinition}
          stackedYAxes={stackedYAxes}
          overlaySlot={!sciChartDefinition.styles.chartOnly ? overlaySlot : undefined}
        />
      </ChartWrapperBox>
    );
  }

  return (
    <ChartWrapperBox style={containerStyle}>
      <SciChartContainer>
        <SciChartReact
          style={SciChartSurfaceStyle}
          fallback={<SkeletonLoading />}
          initChart={initChart}
        >
          <SciChartRuntimeEffects
            definition={sciChartDefinition}
            dataBounds={dataBounds}
          />
          {!sciChartDefinition.styles.chartOnly && overlaySlot}
        </SciChartReact>
      </SciChartContainer>
    </ChartWrapperBox>
  );
};
