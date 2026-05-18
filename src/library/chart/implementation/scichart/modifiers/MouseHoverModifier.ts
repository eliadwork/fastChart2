import {
  ChartModifierBase2D,
  EChart2DModifierType,
  ModifierMouseArgs,
  translateFromCanvasToSeriesViewRect,
} from 'scichart';

export interface MouseHoverModifierOptions {
  onHover?: (event: MouseEvent) => void;
}

/** Attached to the MouseEvent fired by MouseHoverModifier on every mouse move. */
export type ChartHoverPayload = {
  /** Data-space coordinates (units of the chart axes). */
  dataPoint: { x: number; y: number };
  /** Pixel coordinates relative to the canvas element's top-left corner. */
  canvasPoint: { x: number; y: number };
};

export class MouseHoverModifier extends ChartModifierBase2D {
  readonly type = EChart2DModifierType.Custom;
  private onHover?: (event: MouseEvent) => void;

  constructor(options?: MouseHoverModifierOptions) {
    super();
    this.onHover = options?.onHover;
    this.receiveHandledEvents = true;
  }

  modifierMouseMove(args: ModifierMouseArgs): void {
    super.modifierMouseMove(args);
    if (!this.onHover) return;

    const translated = translateFromCanvasToSeriesViewRect(
      args.mousePoint,
      this.parentSurface.seriesViewRect
    );
    if (!translated) return;

    const xAxis = this.getIncludedXAxis()[0];
    if (!xAxis) return;
    const xCoordCalc = xAxis.getCurrentCoordinateCalculator();
    if (!xCoordCalc) return;

    const yAxis = this.getIncludedYAxis()[0];
    const yCoordCalc = yAxis?.getCurrentCoordinateCalculator();

    const rect = this.parentSurface.domCanvas2D?.getBoundingClientRect();
    const clientX = rect ? rect.left + args.mousePoint.x : args.mousePoint.x;
    const clientY = rect ? rect.top + args.mousePoint.y : args.mousePoint.y;

    const payload: ChartHoverPayload = {
      dataPoint: {
        x: xCoordCalc.getDataValue(translated.x),
        y: yCoordCalc ? yCoordCalc.getDataValue(translated.y) : 0,
      },
      canvasPoint: {
        x: args.mousePoint.x,
        y: args.mousePoint.y,
      },
    };

    this.onHover(
      Object.assign(new MouseEvent('mousemove', { clientX, clientY, bubbles: true }), payload)
    );
  }
}
