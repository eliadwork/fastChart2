import type { ChartOptions } from '../chart';

import { DETECT_HOW_TO_USE_ADDITIONAL } from './detectConstants';

export interface ResolveDetectChartOptionsParams {
  options: ChartOptions;
  hasData: boolean;
  onMiddleClick: (event: MouseEvent) => void;
}

const detectHoverLogger = (event: MouseEvent) => {
  if ('dataPoint' in event) {
    console.log('detect hover location:', event.dataPoint);
  }
};

export const resolveDetectChartOptions = ({
  options,
  hasData,
  onMiddleClick,
}: ResolveDetectChartOptionsParams): ChartOptions => {
  const onHover = (event: MouseEvent) => {
    detectHoverLogger(event);
    options.events?.onhover?.(event);
  };

  if (!hasData) {
    return {
      ...options,
      howToUseAdditional: options.howToUseAdditional ?? DETECT_HOW_TO_USE_ADDITIONAL,
      events: {
        ...options.events,
        onhover: onHover,
      },
    };
  }

  return {
    ...options,
    howToUseAdditional: options.howToUseAdditional ?? DETECT_HOW_TO_USE_ADDITIONAL,
    events: {
      ...options.events,
      onmiddleclick: onMiddleClick,
      onhover: onHover,
    },
  };
};
