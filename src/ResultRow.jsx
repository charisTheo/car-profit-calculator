import React from 'react';
import { Grid, Typography } from '@mui/material';
import { formatCurrency } from './utils';

function ResultRow({ label, value, isBold = false, isHighlighted = false, isFinal = false }) {
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{
        mb: 1.5,
        borderBottom: '1px dashed',
        borderColor: 'text.secondary',
      }}
    >
      <Grid item>
        <Typography variant={isFinal ? 'h6' : 'body1'} sx={{ fontWeight: isBold ? 'bold' : 'normal' }}>
          {label}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          variant={isFinal ? 'h6' : 'body1'}
          sx={{ fontWeight: isBold ? 'bold' : 'normal', color: isHighlighted ? 'success.main' : 'text.primary' }}
        >
          {formatCurrency(value)}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ResultRow;
