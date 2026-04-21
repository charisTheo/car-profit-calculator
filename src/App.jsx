import React, { useState, useMemo, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Box,
  Divider,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useExchangeRate } from './hooks';
import { CY_VAT_RATE, IMPORT_LOCATION, REGISTRATION_FEE } from './constants';
import { calculateFinancials } from './calculations';
import { getInitialOptionsFromUrl, syncOptionsToUrl } from './urlState';
import TooltipBreakdownRow from './TooltipBreakdownRow';
import CurrencySelector from './CurrencySelector';
import ExchangeRateProviderSelector from './ExchangeRateProviderSelector';
import InitialPriceField from './InitialPriceField';
import ProfitPercentageField from './ProfitPercentageField';
import FuelAndEmissionsField from './FuelAndEmissionsField';
import JapanOptions from './JapanOptions';
import UkOptions from './UkOptions';
import FinancialBreakdownHeader from './FinancialBreakdownHeader';
import ResultRow from './ResultRow';
import ImportLocationSelector from './ImportLocationSelector';
import ClassicToggle from './ClassicToggle';
import { useAppTheme } from './theme';
import { formatCurrency } from './utils';

const StyledDivider = styled(Divider)({
  '--mui-spacing': '8px',
  margin: 'calc(3 * var(--mui-spacing)) calc(-2 * var(--mui-spacing))',
  borderColor: '#90caf9',
  width: 'calc(100% + 4 * var(--mui-spacing))',
});

function App() {
  const initialOptions = useMemo(() => getInitialOptionsFromUrl(), []);
  const theme = useAppTheme();

  const [initialPrice, setInitialPrice] = useState(initialOptions.initialPrice);
  const [profitPercentage, setProfitPercentage] = useState(initialOptions.profitPercentage);
  const [shippingCosts, setShippingCosts] = useState(initialOptions.shippingCosts);
  const [emissions, setEmissions] = useState(initialOptions.emissions);
  const [fuelType, setFuelType] = useState(initialOptions.fuelType);
  const [japanMade, setJapanMade] = useState(initialOptions.japanMade);
  const [ukMade, setUkMade] = useState(initialOptions.ukMade);
  const [isVATQualified, setIsVATQualified] = useState(initialOptions.isVATQualified);
  const [includeAuctionFees, setIncludeAuctionFees] = useState(initialOptions.includeAuctionFees);
  const [auctionSite, setAuctionSite] = useState(initialOptions.auctionSite);
  const [importLocation, setImportLocation] = useState(initialOptions.importLocation);
  const [currency, setCurrency] = useState(initialOptions.currency);
  const [convertedPrice, setConvertedPrice] = useState('');
  const [isAntique, setIsAntique] = useState(initialOptions.isAntique);
  const [exchangeRateProvider, setExchangeRateProvider] = useState(
    initialOptions.exchangeRateProvider
  );
  const exchangeRate = useExchangeRate(exchangeRateProvider, { from: 'EUR', to: currency });
  const japaneseExchangeRate = useExchangeRate(exchangeRateProvider, { from: 'JPY', to: 'EUR' });

  // Convert price to EUR when currency or initialPrice changes
  useEffect(() => {
    const parsedPrice = Number(initialPrice) || 0;
    const eurPrice = parsedPrice / exchangeRate;
    setConvertedPrice(eurPrice.toString());
  }, [initialPrice, exchangeRate]);

  useEffect(() => {
    syncOptionsToUrl({
      initialPrice,
      profitPercentage,
      shippingCosts,
      emissions,
      fuelType,
      japanMade,
      ukMade,
      isVATQualified,
      includeAuctionFees,
      auctionSite,
      importLocation,
      currency,
      isAntique,
      exchangeRateProvider,
    });
  }, [
    currency,
    emissions,
    exchangeRateProvider,
    fuelType,
    importLocation,
    includeAuctionFees,
    auctionSite,
    initialPrice,
    isAntique,
    isVATQualified,
    japanMade,
    profitPercentage,
    shippingCosts,
    ukMade,
  ]);

  const calculations = useMemo(() => {
    return calculateFinancials({
      emissions,
      convertedPrice,
      shippingCosts,
      currency,
      initialPrice,
      profitPercentage,
      japanMade,
      ukMade,
      isVATQualified,
      includeAuctionFees,
      auctionSite,
      importLocation,
      isAntique,
      japaneseExchangeRate,
    });
  }, [
    convertedPrice,
    shippingCosts,
    currency,
    initialPrice,
    profitPercentage,
    japanMade,
    ukMade,
    isVATQualified,
    emissions,
    includeAuctionFees,
    auctionSite,
    importLocation,
    isAntique,
    japaneseExchangeRate,
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Container maxWidth="none" sx={{ py: 4 }}>
          <Grid container spacing={2} justifyContent="center">

            {/* --- Input Section --- */}
            <Grid size={{xs: 12, md: 5}}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Box component="form" noValidate autoComplete="off">
                  <FormControl component="fieldset" sx={{
                      mb: 2,
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <CurrencySelector currency={currency} onCurrencyChange={setCurrency} />

                    <ExchangeRateProviderSelector
                      exchangeRateProvider={exchangeRateProvider}
                      onExchangeRateProviderChange={setExchangeRateProvider}
                    />
                  </FormControl>

                  <InitialPriceField
                    currency={currency}
                    initialPrice={initialPrice}
                    convertedPrice={convertedPrice}
                    onInitialPriceChange={setInitialPrice}
                  />

                  <ProfitPercentageField
                    profitPercentage={profitPercentage}
                    onProfitPercentageChange={setProfitPercentage}
                  />

                  <TextField
                    fullWidth
                    label="Shipping Costs (€)"
                    variant="outlined"
                    type="number"
                    value={shippingCosts}
                    onChange={(e) => setShippingCosts(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <FuelAndEmissionsField
                    fuelType={fuelType}
                    onFuelTypeChange={setFuelType}
                    emissions={emissions}
                    onEmissionsChange={setEmissions}
                  />


                  <ImportLocationSelector
                    importLocation={importLocation}
                    onImportLocationChange={setImportLocation}
                  />

                {importLocation === IMPORT_LOCATION.JAPAN && (
                  <JapanOptions
                    includeAuctionFees={includeAuctionFees}
                    auctionSite={auctionSite}
                    onAuctionSiteChange={setAuctionSite}
                    japanMade={japanMade}
                    onJapanMadeChange={setJapanMade}
                    onIncludeAuctionFeesChange={setIncludeAuctionFees}
                  />
                )}

                {importLocation === IMPORT_LOCATION.UK && (
                  <UkOptions
                    ukMade={ukMade}
                    onUkMadeChange={setUkMade}
                    isVATQualified={isVATQualified}
                    onIsVATQualifiedChange={setIsVATQualified}
                  />
                )}

                  <ClassicToggle
                    isAntique={isAntique}
                    onIsAntiqueChange={setIsAntique}
                  />
              </Box>
            </Paper>
          </Grid>

          {/* --- Results Section --- */}
          <Grid size={{xs: 12, md: 7}}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
              <FinancialBreakdownHeader />

              <Divider sx={{ mb: 1 }} />

              {/* Cost Breakdown */}
              <Typography variant="h6" color="text.secondary" gutterBottom>COSTS</Typography>
              <ResultRow label="Initial Car Price" value={calculations.initialPrice} />
              {calculations.ukReturnedVAT > 0 && (
                <ResultRow label="UK Returned VAT (20%)" value={calculations.ukReturnedVAT} />
              )}
              <ResultRow label="Shipping Costs" value={calculations.shippingCosts} />
              <ResultRow label={`Import Duties (${calculations.importDutyRate * 100}%)`} value={calculations.importDuties} />

              {calculations.auctionFee > 0 && (
                <TooltipBreakdownRow
                  label="Auction Fees"
                  value={formatCurrency(calculations.auctionFee)}
                  tooltipContent={
                    <Box>
                      <Typography variant="body2">
                        Service Fee: {formatCurrency(calculations.auctionFeeBreakdown.serviceFee)}
                      </Typography>
                      <Typography variant="body2">
                        Documentation Fee: {formatCurrency(calculations.auctionFeeBreakdown.documentationFee)}
                      </Typography>
                      <Typography variant="body2">
                        Transportation Fee: {formatCurrency(calculations.auctionFeeBreakdown.transportationFee)}
                      </Typography>
                    </Box>
                  }
                />
              )}

              {calculations.bankTransferFees > 0 && (
                <TooltipBreakdownRow
                  label={`Bank transfer (EUR → ${importLocation === IMPORT_LOCATION.UK ? 'GBP' : 'JPY'})`}
                  value={formatCurrency(calculations.bankTransferFees)}
                  tooltipContent={(
                    <Typography variant="body2">
                      Eurobank tariff (03/2025): outgoing payment in foreign currency with debit in EUR
                      {' '}-- 0.30% (min EUR 6, max EUR 500). Based on car price plus auction fees
                      {' '}in EUR. SHA/OUR, same-day, or other optional charges are not included;
                      {' '}the bank may pass on correspondent costs.
                    </Typography>
                  )}
                />
              )}

              <ResultRow label="Registration Fee" value={REGISTRATION_FEE} />
              <ResultRow label="Road Tax" value={calculations.emissionsCost} />

              <StyledDivider />

              <ResultRow label="Total Landed Cost" value={calculations.totalLandedCost} isBold />
              <ResultRow label={`VAT on Landed Cost (${calculations.totalLandedCost} x ${CY_VAT_RATE * 100}%)`} value={calculations.vatOnLandedCost} />
              <ResultRow label={`Additional VAT on Profit (${calculations.profit} x ${CY_VAT_RATE * 100}%)`} value={calculations.additionalVAT} />
              <ResultRow label="Total Costs" value={calculations.totalCosts} isFinal isHighlighted />

              <StyledDivider />

              {/* Price & Profit Breakdown */}
              <Typography variant="h6" color="text.secondary" sx={{ mt: 0 }} gutterBottom>PRICE & PROFIT</Typography>
              <ResultRow label="Profit" value={calculations.profit} />
              <ResultRow label="Required Sale Price" value={calculations.finalSalePrice} isFinal isHighlighted />
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
