import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { DEFAULT_CHART_ICONS, Detect } from './library';
import { SciChartWrapper } from './library/chart/implementation/scichart';
import { FastChartingPanel } from './features/fastCharting/FastChartingPanel';
import { ChartComparison, ChartComparisonGrid, ChartPanel } from './styled/ChartStyled';
import { useChartDataFlow } from './features/chartData/hooks/useChartDataFlow';
import type { ChartAxisConfig, ChartShape } from './library';

const App = () => {
  const { chartData, canAddLine, addLine } = useChartDataFlow();
  const [hoverLocation, setHoverLocation] = useState<{ x: number; y: number } | null>(null);
  const handleHover = useCallback((event: MouseEvent) => {
    if (!('dataPoint' in event)) return;
    const point = event.dataPoint;
    if (
      typeof point !== 'object' || point === null ||
      !('x' in point) || typeof point.x !== 'number' ||
      !('y' in point) || typeof point.y !== 'number'
    ) return;
    setHoverLocation({ x: point.x, y: point.y });
  }, []);

  return (
    <ChartComparison>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={addLine}
          disabled={!canAddLine}
        >
          Add Line
        </Button>
        <Box component="span">
          {hoverLocation
            ? `Hover: x ${hoverLocation.x.toFixed(2)}, y ${hoverLocation.y.toFixed(2)}`
            : 'Hover over a chart to see its coordinates'}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, minWidth: 0 }}>
        <ChartComparisonGrid sx={{ flex: 1, minWidth: 0 }}>
          <ChartPanel>
            <DetectStyled
              chartId="resampled"
              title="Resampled (precision 1.0)"
              data={chartData}
              shapes={exampleShapes}
              options={{
                note: 'this is the chart example',
                events: { onhover: handleHover },
                resampling: { enable: true, precision: 1 },
                yAxes: STACKED_Y_AXES,
              }}
              icons={DEFAULT_CHART_ICONS}
              ImplementationComponent={SciChartWrapper}
            />
          </ChartPanel>
          <ChartPanel>
            <DetectStyled
              chartId="no-loss"
              title="No-loss (every point)"
              data={chartData}
              shapes={exampleShapes}
              options={{
                note: 'this is the chart example',
                events: { onhover: handleHover },
                yAxes: STACKED_Y_AXES,
              }}
              ImplementationComponent={SciChartWrapper}
            />
          </ChartPanel>
        </ChartComparisonGrid>
        <FastChartingPanel
          chartId="fast"
          title="Fast chart"
          data={chartData}
          shapes={exampleShapes}
          options={{
            note: '20% panel',
            events: { onhover: handleHover },
            clipZoomToData: true,
            yAxes: STACKED_Y_AXES,
          }}
          icons={DEFAULT_CHART_ICONS}
          ImplementationComponent={SciChartWrapper}
        />
      </Box>
    </ChartComparison>
  );
};

export default App;

const DetectStyled = styled(Detect)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  minHeight: 0,
}));

const STACKED_Y_AXES: ChartAxisConfig[] = [
  { id: 'default', stacked: true, heightWeight: 70 },
  { id: 'secondary', name: 'Secondary', stacked: true, heightWeight: 30 },
];

const exampleShapes: ChartShape[] = [
  {
    shape: 'line',
    color: '#00ff00',
    axis: 'x',
    value: 250000,
  },
  {
    shape: 'box',
    name: 'Target Region',
    color: '#00BFFF',
    coordinates: { x1: 100000, x2: 200000, y1: -1000, y2: 1000 },
  },
  {
    shape: 'box',
    name: 'Full-height band',
    color: '#FFA500',
    fill: '#FFA50022',
    coordinates: { x1: 350000, x2: 450000 },
  },
];
