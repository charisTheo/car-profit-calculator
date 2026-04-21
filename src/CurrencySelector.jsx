import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

function CurrencySelector({ currency, onCurrencyChange }) {
  return (
    <ButtonGroup orientation="horizontal">
      <Button
        size="small"
        value="EUR"
        variant={currency === 'EUR' ? 'contained' : 'outlined'}
        onClick={() => onCurrencyChange('EUR')}
      >
        🇪🇺 EUR (€)
      </Button>
      <Button
        size="small"
        value="GBP"
        variant={currency === 'GBP' ? 'contained' : 'outlined'}
        onClick={() => onCurrencyChange('GBP')}
      >
        🇬🇧 GBP (£)
      </Button>
      <Button
        size="small"
        value="JPY"
        variant={currency === 'JPY' ? 'contained' : 'outlined'}
        onClick={() => onCurrencyChange('JPY')}
      >
        🇯🇵 JPY (¥)
      </Button>
    </ButtonGroup>
  );
}

export default CurrencySelector;
