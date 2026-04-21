import React from "react";
import { Box, Icon, Typography } from "@mui/material";
import EuroSymbolIcon from "@mui/icons-material/EuroSymbol";

function FinancialBreakdownHeader() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
      <Icon fontSize="large" color="primary" sx={{ mr: 1 }}>
        <EuroSymbolIcon sx={{ verticalAlign: "text-top" }} />
      </Icon>
      <Typography variant="h5" component="h2">
        Financial Breakdown
      </Typography>
    </Box>
  );
}

export default FinancialBreakdownHeader;
