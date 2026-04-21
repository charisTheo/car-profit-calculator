import React from "react";
import { Grid, Tooltip, Typography } from "@mui/material";

function TooltipBreakdownRow({ label, value, tooltipContent }) {
  return (
    <Tooltip
      title={tooltipContent}
      placement="top"
      arrow
      slotProps={{
        tooltip: { sx: { backgroundColor: "background.default", p: 1 } },
        arrow: { sx: { color: "background.default" } },
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mb: 1.5,
          borderBottom: "1px dashed",
          borderColor: "primary.main",
          cursor: "help",
          "&:hover": { borderColor: "secondary.main" },
        }}
      >
        <Grid item>
          <Typography variant="body1">{label}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">{value}</Typography>
        </Grid>
      </Grid>
    </Tooltip>
  );
}

export default TooltipBreakdownRow;
