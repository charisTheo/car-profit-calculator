import React from 'react';
import { Box, Button, ButtonGroup, TextField } from '@mui/material';

function ProfitPercentageField({ profitPercentage, onProfitPercentageChange }) {
  return (
    <>
      <TextField
        fullWidth
        label="Profit (%)"
        variant="outlined"
        type="number"
        value={profitPercentage}
        onChange={(e) => onProfitPercentageChange(e.target.value)}
        sx={{ mb: 1 }}
      />

      <Box sx={{ mb: 2 }}>
        <ButtonGroup variant="outlined" size="small" fullWidth>
          <Button
            onClick={() => onProfitPercentageChange('5')}
            variant={profitPercentage === '5' ? 'contained' : 'outlined'}
          >
            5%
          </Button>
          <Button
            onClick={() => onProfitPercentageChange('8')}
            variant={profitPercentage === '8' ? 'contained' : 'outlined'}
          >
            8%
          </Button>
          <Button
            onClick={() => onProfitPercentageChange('15')}
            variant={profitPercentage === '15' ? 'contained' : 'outlined'}
          >
            15%
          </Button>
        </ButtonGroup>
      </Box>
    </>
  );
}

export default ProfitPercentageField;
