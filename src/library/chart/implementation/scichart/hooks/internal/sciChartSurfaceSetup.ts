import {
  EAutoRange,
  HorizontalLineAnnotation,
  NumericAxis,
  SciChartSurface,
} from 'scichart';

import {
  MAIN_Y_AXIS_STACKED_LENGTH,
  SECOND_Y_AXIS_ID,
  SECOND_Y_AXIS_STACKED_LENGTH,
  SCI_CHART_ZERO_LINE_STROKE_THICKNESS,
} from '../../sciChartWrapperConstants';

export interface CreateSciChartSurfaceOptions {
  rootElement: HTMLDivElement | string;
  backgroundColor: string;
  textColor: string;
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
}: CreateSciChartSurfaceOptions) => {
  const element = resolveRootElement(rootElement);
  if (!element) {
    throw new Error('SciChart root element not found');
  }

  const { sciChartSurface, wasmContext } = await SciChartSurface.create(element, {
    background: backgroundColor,
  });

  const axisOptions = { labelStyle: { color: textColor } };

  const xAxis = new NumericAxis(wasmContext, axisOptions);

  // Primary Y axis — occupies top 80% of the chart height
  const yAxis = new NumericAxis(wasmContext, {
    ...axisOptions,
    id: 'DefaultAxisId',
    stackedAxisLength: MAIN_Y_AXIS_STACKED_LENGTH,
  });

  // Secondary Y axis — occupies bottom 20%, independently auto-scaled to series[0]
  const secondYAxis = new NumericAxis(wasmContext, {
    ...axisOptions,
    id: SECOND_Y_AXIS_ID,
    stackedAxisLength: SECOND_Y_AXIS_STACKED_LENGTH,
    autoRange: EAutoRange.Always,
    drawMajorGridLines: false,
    drawMinorGridLines: false,
  });

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);
  sciChartSurface.yAxes.add(secondYAxis);

  // Separator between the two stacked bands.
  // ECoordinateMode.Relative: y=0 is top, y=1 is bottom → 80/20 boundary sits at y=0.8.
  sciChartSurface.annotations.add(
    new HorizontalLineAnnotation({
      y1: 0.8,
      yCoordinateMode: ECoordinateMode.Relative,
      stroke: textColor,
      strokeThickness: SCI_CHART_ZERO_LINE_STROKE_THICKNESS,
      opacity: 0.3,
    })
  );

  return { sciChartSurface };
};
