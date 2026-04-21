import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

function UkOptions({ ukMade, onUkMadeChange, isVATQualified, onIsVATQualifiedChange }) {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={ukMade}
            onChange={(e) => onUkMadeChange(e.target.checked)}
            name="ukMade"
            color="primary"
          />
        }
        label="UK made 🇬🇧"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isVATQualified}
            onChange={(e) => onIsVATQualifiedChange(e.target.checked)}
            name="isVATQualified"
            color="primary"
          />
        }
        label="VAT Qualifying"
      />
    </>
  );
}

export default UkOptions;
