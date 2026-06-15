import type { ChartData, ChartDataSeries } from '../../../library/chart';
import type { ChartDataWorkerResponse } from '../chartDataContracts';

const FALLBACK_SAMPLE_X = new Float64Array([0, 100_000, 200_000, 300_000, 400_000, 500_000]);
const FALLBACK_SAMPLE_Y = new Float64Array([0, 1000, -500, 2000, -1000, 0]);
const FALLBACK_SECONDARY_Y = new Float64Array([0, 0.5, -0.25, 1.0, -0.5, 0]);
const DEFAULT_LINE_STYLE: ChartDataSeries['style'] = { bindable: true };
const SECONDARY_AXIS_ID = 'secondary';

const resolveLineStyle = (
  style: ChartDataSeries['style'] | undefined
): ChartDataSeries['style'] => style ?? DEFAULT_LINE_STYLE;

export const resolveChartDataWorkerResponse = (
  response: ChartDataWorkerResponse
): ChartData => {
  const lines: ChartData = response.lines.map((line) => ({
    x: new Float64Array(line.x),
    y: new Float64Array(line.y),
    name: line.name,
    lineGroupKey: line.lineGroupKey,
    style: resolveLineStyle(line.style),
  }));

  const firstLine = lines[0];
  if (firstLine != null) {
    lines.push({
      x: firstLine.x,
      y: new Float64Array(Array.from(firstLine.y, (v) => v * 0.001)),
      name: 'Secondary',
      lineGroupKey: 'Secondary',
      style: { ...DEFAULT_LINE_STYLE, color: '#ff9900' },
      yAxisId: SECONDARY_AXIS_ID,
    });
  }

  return lines;
};

export const resolveFallbackChartData = (): ChartData => [
  {
    x: FALLBACK_SAMPLE_X,
    y: FALLBACK_SAMPLE_Y,
    name: 'Fallback-S0',
    lineGroupKey: 'Fallback',
    style: DEFAULT_LINE_STYLE,
  },
  {
    x: FALLBACK_SAMPLE_X,
    y: FALLBACK_SECONDARY_Y,
    name: 'Secondary',
    lineGroupKey: 'Secondary',
    style: { ...DEFAULT_LINE_STYLE, color: '#ff9900' },
    yAxisId: SECONDARY_AXIS_ID,
  },
];
