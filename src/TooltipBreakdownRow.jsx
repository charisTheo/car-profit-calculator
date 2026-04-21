import React, { useState } from "react";
import {
  ClickAwayListener,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

function TooltipBreakdownRow({ label, value, tooltipContent }) {
  const isTouchDevice = useMediaQuery("(hover: none)");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleTooltipToggle = () => {
    if (!isTouchDevice) return;
    setIsTooltipOpen((prevOpen) => !prevOpen);
  };

  const handleTooltipClose = () => {
    if (!isTouchDevice) return;
    setIsTooltipOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        title={tooltipContent}
        placement="top"
        arrow
        open={isTouchDevice ? isTooltipOpen : undefined}
        disableFocusListener={isTouchDevice}
        disableHoverListener={isTouchDevice}
        disableTouchListener={isTouchDevice}
        onClose={handleTooltipClose}
        slotProps={{
          tooltip: { sx: { backgroundColor: "background.default", p: 1 } },
          arrow: { sx: { color: "background.default" } },
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          onClick={handleTooltipToggle}
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
    </ClickAwayListener>
  );
}

export default TooltipBreakdownRow;
