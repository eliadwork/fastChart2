import type { ResolvedSciChartData, ResolvedSciChartDefinition, SciChartAxisConfig } from './scichartOptions';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { EAutoRange, NumberRange, SciChartSurface, SciChartVerticalGroup } from 'scichart';

import { createSciChartModifiers } from './hooks/internal/sciChartModifierFactory';
import { applyVisibleRangeLimits } from './hooks/internal/sciChartRangeLimits';
import { rebuildRenderableSeries } from './hooks/internal/sciChartSeriesRuntime';
import { createSciChartSurfaceWithAxes } from './hooks/internal/sciChartSurfaceSetup';
import { addZeroLineAnnotations } from './hooks/internal/sciChartZeroLines';
import { useSciChartDataBoundsModel } from './hooks/model/useSciChartDataBoundsModel';
import { SciChartStackedPanelEffects } from './SciChartStackedPanelEffects';

const DEFAULT_Y_AXIS_ID = 'default';

interface SciChartStackedSurfacesProps {
  definition: ResolvedSciChartDefinition;
  stackedYAxes: SciChartAxisConfig[];
  overlaySlot?: React.ReactNode;
}

/** Slice definition.data into per-axis panels, preserving global seriesVisibility indices. */
const buildPanelData = (
  data: ResolvedSciChartDefinition['data'],
  stackedYAxes: SciChartAxisConfig[]
): ResolvedSciChartData[] =>
  stackedYAxes.map((axis) => {
    const matched = data.series
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => (s.yAxisId ?? DEFAULT_Y_AXIS_ID) === axis.id);

    return {
      series: matched.map(({ s }) => s),
      seriesVisibility: matched.map(({ i }) => data.seriesVisibility[i] ?? true),
    };
  });

export const SciChartStackedSurfaces = ({
  definition,
  stackedYAxes,
  overlaySlot,
}: SciChartStackedSurfacesProps) => {
  const divRefs = useRef<(HTMLDivElement | null)[]>([]);
  const surfacesRef = useRef<SciChartSurface[]>([]);
  const verticalGroupRef = useRef<SciChartVerticalGroup | null>(null);
  const modifierGroupId = useRef(`sci-stacked-${Math.random().toString(36).slice(2)}`);
  const xSyncPropagating = useRef(false);

  // readySurfaces is state (not just a ref) so that React re-renders when surfaces
  // become available, unblocking the data-sync effect and panel effects components.
  const [readySurfaces, setReadySurfaces] = useState<SciChartSurface[]>([]);

  // Always-current refs so the init effect closure isn't stale
  const definitionRef = useRef(definition);
  definitionRef.current = definition;
  const stackedYAxesRef = useRef(stackedYAxes);
  stackedYAxesRef.current = stackedYAxes;

  const panelDataList = useMemo(
    () => buildPanelData(definition.data, stackedYAxes),
    [definition.data, stackedYAxes]
  );
  const panelDataListRef = useRef(panelDataList);
  panelDataListRef.current = panelDataList;

  const globalBounds = useSciChartDataBoundsModel(definition.data);
  const globalBoundsRef = useRef(globalBounds);
  globalBoundsRef.current = globalBounds;

  // Init: rebuild all surfaces when panel count changes
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // Tear down any existing surfaces first
      for (const surface of surfacesRef.current) {
        verticalGroupRef.current?.removeSurface(surface);
        surface.delete();
      }
      surfacesRef.current = [];
      setReadySurfaces([]);

      if (!verticalGroupRef.current) {
        verticalGroupRef.current = new SciChartVerticalGroup();
      }

      const axes = stackedYAxesRef.current;
      const def = definitionRef.current;
      const panels = panelDataListRef.current;
      const newSurfaces: SciChartSurface[] = [];

      for (let i = 0; i < axes.length; i++) {
        const el = divRefs.current[i];
        if (!el || cancelled) break;

        const { sciChartSurface } = await createSciChartSurfaceWithAxes({
          rootElement: el,
          backgroundColor: def.styles.backgroundColor,
          textColor: def.styles.textColor,
          xAxisDrawLabels: i === axes.length - 1,
        });

        if (cancelled) {
          sciChartSurface.delete();
          break;
        }

        sciChartSurface.yAxes.asArray()[0].autoRange = EAutoRange.Always;

        const panelData = panels[i];
        if (panelData) {
          rebuildRenderableSeries({
            surface: sciChartSurface,
            data: panelData,
            seriesConfig: def.options.resampling,
          });
          sciChartSurface.invalidateElement();
        }

        addZeroLineAnnotations(sciChartSurface, def.styles.zeroLineColor);

        const modifiers = createSciChartModifiers({
          interactionOptions: def.options,
          modifierGroupId: modifierGroupId.current,
        });
        for (const modifier of modifiers) {
          try {
            sciChartSurface.chartModifiers.add(modifier);
          } catch {
            // Some modifiers (e.g. RubberBandXyZoomModifier) access svgRoot before
            // the surface is fully attached. Skip and continue.
          }
        }

        verticalGroupRef.current.addSurfaceToGroup(sciChartSurface);

        // X-axis visibleRangeChanged: propagates rubber-band zoom X to all other panels
        const xAxis = sciChartSurface.xAxes.asArray()[0];
        if (xAxis) {
          xAxis.visibleRangeChanged.subscribe((args) => {
            if (!args || xSyncPropagating.current || !args.visibleRange) return;
            xSyncPropagating.current = true;
            const range = new NumberRange(args.visibleRange.min, args.visibleRange.max);
            for (const other of surfacesRef.current) {
              if (other === sciChartSurface) continue;
              const otherX = other.xAxes.asArray()[0];
              if (otherX) otherX.visibleRange = range;
            }
            xSyncPropagating.current = false;
          });
        }

        sciChartSurface.zoomExtents();
        newSurfaces.push(sciChartSurface);
      }

      if (!cancelled) {
        surfacesRef.current = newSurfaces;
        setReadySurfaces(newSurfaces);
      }
    };

    void init();

    return () => {
      cancelled = true;
      for (const surface of surfacesRef.current) {
        verticalGroupRef.current?.removeSurface(surface);
        surface.delete();
      }
      surfacesRef.current = [];
      setReadySurfaces([]);
    };
  }, [stackedYAxes.length]);

  // Data sync: update each surface's series when data or visibility changes.
  // Reads surfacesRef (not readySurfaces state) to avoid re-running after every init.
  // Init already builds series; this effect only fires when DATA changes afterwards.
  useEffect(() => {
    const surfaces = surfacesRef.current;
    if (surfaces.length !== stackedYAxes.length) return;

    for (let i = 0; i < surfaces.length; i++) {
      const surface = surfaces[i];
      const panelData = panelDataList[i];
      if (!surface || !panelData) continue;

      rebuildRenderableSeries({
        surface,
        data: panelData,
        seriesConfig: definition.options.resampling,
      });
      applyVisibleRangeLimits(surface, globalBounds, definition.options.clipZoomToData);
      surface.invalidateElement();
    }
  }, [panelDataList, definition.options.resampling, definition.options.clipZoomToData, globalBounds, stackedYAxes.length]);

  // Zoom reset: register callback that resets all panels simultaneously
  useEffect(() => {
    const zoomCallbacks = definition.options.events?.zoom;
    if (!zoomCallbacks || readySurfaces.length === 0) return;
    zoomCallbacks.setZoomReset(() => {
      zoomCallbacks.pushBeforeResetRef.current?.();
      for (const s of readySurfaces) s.zoomExtents();
    });
    return () => zoomCallbacks.setZoomReset(() => {});
  }, [readySurfaces, definition.options.events?.zoom]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
      }}
    >
      {stackedYAxes.map((axis, i) => (
        <div
          key={axis.id}
          id={`${modifierGroupId.current}-${axis.id}`}
          ref={(el) => {
            divRefs.current[i] = el;
          }}
          style={{ flex: 1, minHeight: 0, position: 'relative' }}
        />
      ))}

      {/* Per-panel sync effects: shapes, icons — rendered once surfaces are ready */}
      {readySurfaces.map((surface, i) => (
        <SciChartStackedPanelEffects
          key={`panel-effects-${i}`}
          surface={surface}
          definition={definition}
          panelData={panelDataList[i] ?? { series: [], seriesVisibility: [] }}
        />
      ))}

      {overlaySlot && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}
        >
          {overlaySlot}
        </div>
      )}
    </Box>
  );
};
