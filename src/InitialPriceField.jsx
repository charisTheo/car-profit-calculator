import React from 'react';
import { TextField, InputAdornment, Button } from '@mui/material';

function InitialPriceField({ currency, initialPrice, convertedPrice, onInitialPriceChange }) {
  return (
    <TextField
      fullWidth
      label={`Car's Initial Price (${currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'})`}
      variant="outlined"
      type="number"
      value={initialPrice}
      onChange={(e) => onInitialPriceChange(e.target.value)}
      sx={{ mb: 2 }}
      helperText={
        currency !== 'EUR' && convertedPrice
          ? `≈ €${Number(convertedPrice).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : ''
      }
      slotProps={{
        input:
          currency === 'JPY'
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const num = Number(initialPrice) || 0;
                        onInitialPriceChange((num * 1e6).toString());
                      }}
                    >
                      ×1M
                    </Button>
                  </InputAdornment>
                ),
              }
            : {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const num = Number(initialPrice) || 0;
                        onInitialPriceChange((num * 1000).toString());
                      }}
                    >
                      ×1k
                    </Button>
                  </InputAdornment>
                ),
              },
      }}
    />
  );
}

export default InitialPriceField;
