import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  TextField,
} from "@mui/material";
import { FUEL_TYPES } from "./constants";

function FuelAndEmissionsField({
  fuelType,
  onFuelTypeChange,
  emissions,
  onEmissionsChange,
}) {
  return (
    <>
      <FormControl component="fieldset" sx={{ mb: 1, width: "100%" }}>
        <ButtonGroup variant="outlined" size="small" fullWidth>
          {Object.entries(FUEL_TYPES).map(([key, type]) => (
            <Button
              key={key}
              onClick={() => onFuelTypeChange(type.value)}
              variant={fuelType === type.value ? "contained" : "outlined"}
            >
              {type.label}
            </Button>
          ))}
        </ButtonGroup>
      </FormControl>

      {fuelType !== FUEL_TYPES.ELECTRIC.value && (
        <>
          <TextField
            fullWidth
            label={
              <span>
                CO<sup>2</sup> Emissions (g/km)
              </span>
            }
            variant="outlined"
            type="number"
            value={emissions}
            onChange={(e) => onEmissionsChange(e.target.value)}
            sx={{ mb: 1 }}
          />

          <Box sx={{ mb: 2 }}>
            <ButtonGroup
              variant="outlined"
              size="small"
              fullWidth
              sx={{ "& .MuiButton-root": { textTransform: "none" } }}
            >
              <Button
                onClick={() => onEmissionsChange("120")}
                variant={emissions === "120" ? "contained" : "outlined"}
              >
                120 g/km
              </Button>
              <Button
                onClick={() => onEmissionsChange("180")}
                variant={emissions === "180" ? "contained" : "outlined"}
              >
                180 g/km
              </Button>
              <Button
                onClick={() => onEmissionsChange("230")}
                variant={emissions === "230" ? "contained" : "outlined"}
              >
                230 g/km
              </Button>
            </ButtonGroup>
          </Box>
        </>
      )}
    </>
  );
}

export default FuelAndEmissionsField;
