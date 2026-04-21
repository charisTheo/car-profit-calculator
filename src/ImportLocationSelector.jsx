import React from "react";
import { Box, Typography, Button, ButtonGroup } from "@mui/material";
import { IMPORT_LOCATION } from "./constants";

function ImportLocationSelector({ importLocation, onImportLocationChange }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Import location
      </Typography>
      <ButtonGroup sx={{ "& .MuiButton-root": { textTransform: "none" } }}>
        <Button
          onClick={() => onImportLocationChange(IMPORT_LOCATION.JAPAN)}
          variant={
            importLocation === IMPORT_LOCATION.JAPAN ? "contained" : "outlined"
          }
        >
          🇯🇵
        </Button>
        <Button
          onClick={() => onImportLocationChange(IMPORT_LOCATION.UK)}
          variant={
            importLocation === IMPORT_LOCATION.UK ? "contained" : "outlined"
          }
        >
          🇬🇧
        </Button>
        <Button
          onClick={() => onImportLocationChange(IMPORT_LOCATION.EU)}
          variant={
            importLocation === IMPORT_LOCATION.EU ? "contained" : "outlined"
          }
        >
          🇪🇺
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default ImportLocationSelector;
