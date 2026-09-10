import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ChartComparison = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  padding: '0.5rem',
  boxSizing: 'border-box',
});

export const ChartComparisonGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.5rem',
  flex: 1,
  minHeight: 0,
});

export const ChartPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: '0.5rem',
  overflow: 'hidden',
  minHeight: 0,
}));
