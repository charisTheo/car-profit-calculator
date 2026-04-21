import React from "react";
import { FormControlLabel, Checkbox, Box, Tooltip } from "@mui/material";

function ClassicToggle({ isAntique, onIsAntiqueChange }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={isAntique}
          onChange={(e) => onIsAntiqueChange(e.target.checked)}
          name="isAntique"
          color="primary"
        />
      }
      label={
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="More than 30 years old">Classic</Tooltip>
        </Box>
      }
    />
  );
}

export default ClassicToggle;
