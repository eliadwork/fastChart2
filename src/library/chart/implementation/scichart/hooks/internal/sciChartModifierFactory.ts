import {
  MouseWheelZoomModifier,
  RolloverModifier,
  RubberBandXyZoomModifier,
  ZoomExtentsModifier,
  ZoomPanModifier,
} from 'scichart';

import { dashToStrokeArray } from '../../convert';
import { AxisStretchModifier } from '../../modifiers/AxisStretchModifier';
import { MiddleClickModifier } from '../../modifiers/MiddleClickModifier';
import { MouseHoverModifier } from '../../modifiers/MouseHoverModifier';
import { toModifierExecuteCondition } from '../../modifiers/modifierExecuteCondition';
import { ZoomHistoryModifier } from '../../modifiers/ZoomHistoryModifier';
import type { ResolvedSciChartOptions } from '../../scichartOptions';
import { SCI_CHART_STRETCH_SENSITIVITY } from '../../sciChartWrapperConstants';


export interface CreateSciChartModifiersOptions {
  interactionOptions: Pick<ResolvedSciChartOptions, 'features' | 'events'>;
  /** When set, navigation and rollover modifiers share this group for cross-surface sync. */
  modifierGroupId?: string;
}

export const createSciChartModifiers = ({
  interactionOptions,
  modifierGroupId,
}: CreateSciChartModifiersOptions): InstanceType<
  typeof import('scichart').ChartModifierBase2D
>[] => {
  const stretchConfig = interactionOptions.features.stretch;
  const panConfig = interactionOptions.features.pan;
  const zoomConfig = interactionOptions.features.zoom;
  const rolloverConfig = interactionOptions.features.rollover;

  const modifiers: InstanceType<typeof import('scichart').ChartModifierBase2D>[] = [
    new MiddleClickModifier({
      onMiddleClick: interactionOptions.events?.clicks?.middle,
    }),
    new ZoomHistoryModifier({
      callbacks: interactionOptions.events?.zoom
        ? {
            setZoomBack: interactionOptions.events?.zoom?.setZoomBack,
            setPushBeforeReset: interactionOptions.events?.zoom?.setPushBeforeReset,
            setCanZoomBack: interactionOptions.events?.zoom?.setCanZoomBack,
          }
        : undefined,
    }),
  ];

  if (stretchConfig.enable) {
    modifiers.push(
      new AxisStretchModifier({
        executeCondition: toModifierExecuteCondition(stretchConfig.trigger),
        sensitivity: SCI_CHART_STRETCH_SENSITIVITY,
        ...(modifierGroupId ? { modifierGroup: modifierGroupId } : {}),
      })
    );
  }

  if (zoomConfig.enable) {
    modifiers.push(
      new RubberBandXyZoomModifier({
        executeCondition: toModifierExecuteCondition(zoomConfig.trigger),
        // No modifierGroup: rubber-band X sync is handled via visibleRangeChanged subscription.
      })
    );
  }

  if (panConfig.enable) {
    modifiers.push(
      new ZoomPanModifier({
        executeCondition: toModifierExecuteCondition(panConfig.trigger),
        ...(modifierGroupId ? { modifierGroup: modifierGroupId } : {}),
      })
    );
  }

  modifiers.push(
    new MouseWheelZoomModifier(modifierGroupId ? { modifierGroup: modifierGroupId } : undefined),
    new ZoomExtentsModifier(modifierGroupId ? { modifierGroup: modifierGroupId } : undefined),
  );

  if (interactionOptions.events?.hover) {
    modifiers.push(new MouseHoverModifier({ onHover: interactionOptions.events.hover }));
  }

  if (rolloverConfig.show) {
    const rolloverDash = dashToStrokeArray(rolloverConfig.dash);

    modifiers.push(
      new RolloverModifier({
        modifierGroup: modifierGroupId,
        showTooltip: false,
        rolloverLineStroke: rolloverConfig.color,
        rolloverLineStrokeDashArray: rolloverDash == null ? [] : rolloverDash,
      })
    );
  }

  return modifiers;
};
