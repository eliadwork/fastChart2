import { NumericAxis, SciChartSurface } from 'scichart';

export interface CreateSciChartSurfaceOptions {
  rootElement: HTMLDivElement | string;
  backgroundColor: string;
  textColor: string;
  /** When false, X-axis tick labels are hidden (used for non-bottom panels in stacked mode). Default: true. */
  xAxisDrawLabels?: boolean;
}

const resolveRootElement = (rootElement: HTMLDivElement | string) => {
  return rootElement === String(rootElement)
    ? document.querySelector<HTMLDivElement>(rootElement)
    : rootElement;
};

export const createSciChartSurfaceWithAxes = async ({
  rootElement,
  backgroundColor,
  textColor,
  xAxisDrawLabels = true,
}: CreateSciChartSurfaceOptions) => {
  const element = resolveRootElement(rootElement);
  if (!element) {
    throw new Error('SciChart root element not found');
  }

  const { sciChartSurface, wasmContext } = await SciChartSurface.create(element, {
    background: backgroundColor,
  });

  const labelStyle = { color: textColor };
  const xAxis = new NumericAxis(wasmContext, {
    labelStyle,
    drawLabels: xAxisDrawLabels,
  });
  const yAxis = new NumericAxis(wasmContext, { labelStyle });
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  return { sciChartSurface };
};
