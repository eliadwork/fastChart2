/**
 * SciChartWrapper – single SciChart implementation component.
 * Resolves SciChart runtime definition, creates initChart, runs sync hooks, and renders SciChartReact.
 */

import type { ChartImplementationProps } from '../implementationProps';
import type { UseSciChartRuntimeSyncFlowOptions } from './hooks/flow/useSciChartRuntimeSyncFlow';
import type { ResolvedSciChartDefinition, SciChartDataBounds } from './scichartOptions';

import { useCallback, useMemo, useRef } from 'react';
import { SciChartSurface, SciChartVerticalGroup } from 'scichart';
import type { VisibleRangeChangedArgs } from 'scichart';
import { SciChartReact } from 'scichart-react';

import { SkeletonLoading } from '../../../skeletonLoader/SkeletonLoading';
import { ChartWrapperBox } from '../../Chart.style';
import { useSciChartSurfaceContext } from './hooks/context/useSciChartSurfaceContext';
import { useSciChartRuntimeFlow } from './hooks/flow/useSciChartRuntimeFlow';
import { useSciChartRuntimeSyncFlow } from './hooks/flow/useSciChartRuntimeSyncFlow';
import { useSciChartSecondPanelFlow } from './hooks/flow/useSciChartSecondPanelFlow';
import { useSciChartOptionsModel } from './hooks/model/useSciChartOptionsModel';
import { useDataSeriesSync } from './hooks/sync/useDataSeriesSync';
import { useIconsSync } from './hooks/sync/useIconsSync';
import { useSeriesVisibilitySync } from './hooks/sync/useSeriesVisibilitySync';
import { useShapesSync } from './hooks/sync/useShapesSync';
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

interface SciChartSecondPanelEffectsProps {
  definition: ResolvedSciChartDefinition;
  dataBounds: SciChartDataBounds;
}

const SciChartSecondPanelEffects = ({ definition, dataBounds }: SciChartSecondPanelEffectsProps) => {
  const { sciChartSurface } = useSciChartSurfaceContext();

  const data = useMemo(
    () => ({
      ...definition.data,
      series: definition.data.series.slice(0, 1),
      seriesVisibility: definition.data.seriesVisibility.slice(0, 1),
    }),
    [definition.data]
  );

  useDataSeriesSync({
    surface: sciChartSurface,
    data,
    dataBounds,
    clipZoomToData: definition.options.clipZoomToData,
    seriesConfig: definition.options.resampling,
    seriesVisibility: data.seriesVisibility,
  });

  useSeriesVisibilitySync(sciChartSurface, data.seriesVisibility);

  useShapesSync({ surface: sciChartSurface, shapes: definition.shapes, dataBounds });

  useIconsSync({ surface: sciChartSurface, icons: definition.icons });

  return null;
};

// Bidirectionally sync X axis visible ranges between two surfaces.
const syncXAxes = (
  top: SciChartSurface,
  bottom: SciChartSurface,
  onCleanup: (cleanup: () => void) => void
) => {
  const topXAxis = top.xAxes.asArray()[0];
  const bottomXAxis = bottom.xAxes.asArray()[0];
  if (!topXAxis || !bottomXAxis) return;

  let syncing = false;

  const onTopChanged = (args?: VisibleRangeChangedArgs) => {
    if (syncing || !args?.visibleRange) return;
    syncing = true;
    bottomXAxis.visibleRange = args.visibleRange;
    syncing = false;
  };

  const onBottomChanged = (args?: VisibleRangeChangedArgs) => {
    if (syncing || !args?.visibleRange) return;
    syncing = true;
    topXAxis.visibleRange = args.visibleRange;
    syncing = false;
  };

  topXAxis.visibleRangeChanged.subscribe(onTopChanged);
  bottomXAxis.visibleRangeChanged.subscribe(onBottomChanged);

  onCleanup(() => {
    try {
      topXAxis.visibleRangeChanged.unsubscribe(onTopChanged);
      bottomXAxis.visibleRangeChanged.unsubscribe(onBottomChanged);
    } catch {}
  });
};

// Forwards pointermove/pointerleave between both canvases so the rollover line
// appears on both panels when hovering either one.
const syncRollovers = (
  top: SciChartSurface,
  bottom: SciChartSurface,
  onCleanup: (cleanup: () => void) => void
) => {
  const topCanvas = top.domCanvas2D;
  const bottomCanvas = bottom.domCanvas2D;
  if (!topCanvas || !bottomCanvas) return;

  let forwarding = false;

  const makeForwarder = (targetCanvas: HTMLCanvasElement) => (e: PointerEvent) => {
    if (forwarding) return;
    forwarding = true;
    const rect = targetCanvas.getBoundingClientRect();
    targetCanvas.dispatchEvent(
      new PointerEvent(e.type, {
        bubbles: false,
        cancelable: true,
        clientX: e.clientX,
        clientY: rect.top + rect.height / 2,
        pointerId: e.pointerId,
        pointerType: e.pointerType,
        isPrimary: e.isPrimary,
        movementX: e.movementX,
      })
    );
    forwarding = false;
  };

  const topToBottom = makeForwarder(bottomCanvas);
  const bottomToTop = makeForwarder(topCanvas);

  topCanvas.addEventListener('pointermove', topToBottom);
  topCanvas.addEventListener('pointerleave', topToBottom);
  bottomCanvas.addEventListener('pointermove', bottomToTop);
  bottomCanvas.addEventListener('pointerleave', bottomToTop);

  onCleanup(() => {
    topCanvas.removeEventListener('pointermove', topToBottom);
    topCanvas.removeEventListener('pointerleave', topToBottom);
    bottomCanvas.removeEventListener('pointermove', bottomToTop);
    bottomCanvas.removeEventListener('pointerleave', bottomToTop);
  });
};

export const SciChartWrapper = ({
  definition,
  containerStyle,
  overlaySlot,
  loading = false,
}: ChartImplementationProps) => {
  const sciChartDefinition = useSciChartOptionsModel({ definition });
  const { initChart, dataBounds } = useSciChartRuntimeFlow({ definition: sciChartDefinition });
  const secondPanelInitChart = useSciChartSecondPanelFlow({
    definition: sciChartDefinition,
    dataBounds,
  });

  const topSurfaceRef = useRef<SciChartSurface | null>(null);
  const bottomSurfaceRef = useRef<SciChartSurface | null>(null);
  const syncCleanupRef = useRef<(() => void) | null>(null);
  const verticalGroupRef = useRef(new SciChartVerticalGroup());

  const trySetupSync = useCallback(() => {
    const top = topSurfaceRef.current;
    const bottom = bottomSurfaceRef.current;
    if (!top || !bottom) return;

    syncCleanupRef.current?.();

    const cleanups: Array<() => void> = [];
    syncXAxes(top, bottom, (fn) => cleanups.push(fn));
    syncRollovers(top, bottom, (fn) => cleanups.push(fn));
    syncCleanupRef.current = () => cleanups.forEach((fn) => fn());
  }, []);

  const wrappedInitChart = useMemo(
    () => async (rootElement: HTMLDivElement | string) => {
      syncCleanupRef.current?.();
      syncCleanupRef.current = null;
      if (topSurfaceRef.current) {
        try { verticalGroupRef.current.removeSurface(topSurfaceRef.current); } catch {}
      }
      const result = await initChart(rootElement);
      topSurfaceRef.current = result.sciChartSurface;
      verticalGroupRef.current.addSurfaceToGroup(result.sciChartSurface);
      trySetupSync();
      return result;
    },
    [initChart, trySetupSync]
  );

  const wrappedSecondPanelInitChart = useMemo(
    () => async (rootElement: HTMLDivElement | string) => {
      syncCleanupRef.current?.();
      syncCleanupRef.current = null;
      if (bottomSurfaceRef.current) {
        try { verticalGroupRef.current.removeSurface(bottomSurfaceRef.current); } catch {}
      }
      const result = await secondPanelInitChart(rootElement);
      bottomSurfaceRef.current = result.sciChartSurface;
      verticalGroupRef.current.addSurfaceToGroup(result.sciChartSurface);
      trySetupSync();
      return result;
    },
    [secondPanelInitChart, trySetupSync]
  );

  if (loading) {
    return (
      <ChartWrapperBox style={containerStyle}>
        <SkeletonLoading />
      </ChartWrapperBox>
    );
  }

  return (
    <ChartWrapperBox style={containerStyle}>
      <SciChartContainer sx={{ display: 'flex', flexDirection: 'column' }}>
        <SciChartReact
          style={SciChartSurfaceStyle}
          fallback={<SkeletonLoading />}
          initChart={wrappedInitChart}
        >
          <SciChartRuntimeEffects definition={sciChartDefinition} dataBounds={dataBounds} />
          {!sciChartDefinition.styles.chartOnly && overlaySlot}
        </SciChartReact>
        <SciChartReact
          style={SciChartSurfaceStyle}
          fallback={<SkeletonLoading />}
          initChart={wrappedSecondPanelInitChart}
        >
          <SciChartSecondPanelEffects definition={sciChartDefinition} dataBounds={dataBounds} />
        </SciChartReact>
      </SciChartContainer>
    </ChartWrapperBox>
  );
};
