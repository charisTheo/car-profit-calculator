import React from "react";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { EXCHANGE_RATE_PROVIDERS } from "./hooks";

function ExchangeRateProviderSelector({
  exchangeRateProvider,
  onExchangeRateProviderChange,
}) {
  return (
    <ToggleButtonGroup
      value={exchangeRateProvider}
      onChange={(e) => onExchangeRateProviderChange(e.target.value)}
      color="primary"
      exclusive
      size="small"
      sx={{
        gap: 1.5,
        px: 1,
        py: 0.75,
        backgroundColor: "background.paper",
        borderRadius: 1,
        "& .MuiButtonBase-root": {
          borderRadius: 0.5,
          "&:not(.Mui-selected)": {
            border: "none",
          },
          "&.Mui-selected": {
            backgroundColor: "primary.main",
          },
        },
      }}
    >
      <Tooltip title="Eurobank Exchange Rate">
        <ToggleButton
          disabled
          value={EXCHANGE_RATE_PROVIDERS.EUROBANK}
          sx={{
            backgroundImage: "url(./eurobank.png)",
            padding: "12px",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        />
      </Tooltip>
      <Tooltip title="Exchange Rate API">
        <ToggleButton
          value={EXCHANGE_RATE_PROVIDERS.EXCHANGERATE_API}
          sx={{
            backgroundImage: "url(./exchangerate-api.com.png)",
            padding: "12px",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        />
      </Tooltip>
    </ToggleButtonGroup>
  );
}

export default ExchangeRateProviderSelector;
