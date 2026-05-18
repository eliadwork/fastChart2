
import { resolveFastChartingInputs } from './resolveFastChartingInputs';
import { useResizableChart } from './hooks/useResizableChart';
import {
  FastChartingChartWrapper,
  FastChartingResizeHandle,
  FastChartingRoot,
} from './FastChartingStyled';
import type { ChartData, ChartIcon, ChartOptions, ChartShape, ChartStyle } from '../../library/chart/types';
import type { ChartImplementationProps } from '../../library/chart/implementation/implementationProps';
import { Chart } from '../../library/chart/Chart';

export interface FastChartingProps {
  chartId: string;
  data: ChartData | null;
  title?: string;
  style?: ChartStyle;
  options?: ChartOptions;
  shapes?: ChartShape[];
  icons?: ChartIcon[];
  ImplementationComponent: React.ComponentType<ChartImplementationProps>;
  /** When true, fills container (100% width/height). When false, uses draggable resize. */
  fill?: boolean;
  /** Forwarded to root element for styled(FastCharting). */
  className?: string;
}

export const FastCharting = ({
  chartId,
  data,
  title,
  style,
  options,
  shapes,
  icons,
  ImplementationComponent,
  fill = false,
  className,
}: FastChartingProps) => {
  const resolvedInputs = resolveFastChartingInputs({ options, shapes, icons });
  const { width, height, resizeHandleProps } = useResizableChart();
  const resizedChartDimensions = fill ? undefined : { width, height };

  return (
    <FastChartingRoot
      className={className}
      $fill={fill}
      $resizedWidth={resizedChartDimensions?.width}
      $resizedHeight={resizedChartDimensions?.height}
    >
      <FastChartingChartWrapper>
        <Chart
          chartId={chartId}
          data={data}
          title={title}
          options={resolvedInputs.options}
          shapes={resolvedInputs.shapes}
          icons={resolvedInputs.icons}
          chartStyle={style}
          ImplementationComponent={ImplementationComponent}
        />
      </FastChartingChartWrapper>
      {!fill && <FastChartingResizeHandle {...resizeHandleProps} />}
    </FastChartingRoot>
  );
};
