import { styled } from '@mui/material/styles';

export const ChartCursorTooltipRoot = styled('div')(({ theme }) => ({
  position: 'absolute',
  pointerEvents: 'none',
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(0.25, 0.875),
  borderRadius: theme.shape.borderRadius,
  fontSize: theme.typography.caption.fontSize,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
  boxShadow: theme.shadows[4],
  zIndex: theme.zIndex.tooltip,
}));
