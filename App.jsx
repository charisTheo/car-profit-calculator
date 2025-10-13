import React, { useState, useMemo } from 'react';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  Container,
  Paper,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Box,
  Divider,
  Icon,
} from '@mui/material';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: prefersDarkMode ? '#90caf9' : '#1976d2',
          },
        },
        typography: {
          h4: {
            fontWeight: 700,
          },
          h6: {
            fontWeight: 600,
          },
        },
      }),
    [prefersDarkMode]
  );

  const [initialPrice, setInitialPrice] = useState('');
  const [profitPercentage, setProfitPercentage] = useState('');
  const [shippingCosts, setShippingCosts] = useState('2000');
  const [isEU, setIsEU] = useState(true);

  const calculations = useMemo(() => {
    const VAT_RATE = 0.19;
    const IMPORT_DUTY_RATE = 0.10;

    const parsedInitialPrice = Number(initialPrice) || 0;
    const parsedShippingCosts = Number(shippingCosts) || 0;
    const parsedProfitPercentage = Number(profitPercentage) || 0;

    const importDuties = isEU ? 0 : parsedInitialPrice * IMPORT_DUTY_RATE;
    const totalLandedCost = parsedInitialPrice + parsedShippingCosts + importDuties;
    const vatOnLandedCost = totalLandedCost * VAT_RATE;
    const desiredProfit = parsedInitialPrice * (parsedProfitPercentage / 100);

    // This formula finds the sale price needed to achieve the desired profit
    // after accounting for the VAT on that profit.
    // SP = (TotalLandedCost + DesiredProfit) / (1 - VAT_RATE)
    const finalSalePrice = (parsedInitialPrice > 0 && parsedProfitPercentage > 0)
        ? (totalLandedCost + desiredProfit) / (1 - VAT_RATE)
        : 0;

    const additionalVAT = (finalSalePrice - totalLandedCost) * VAT_RATE;
    const totalCosts = totalLandedCost + vatOnLandedCost + additionalVAT;
    const finalProfit = finalSalePrice - totalCosts;

    // Return all values, rounded to the nearest integer
    return {
      initialPrice: Math.round(parsedInitialPrice),
      shippingCosts: Math.round(parsedShippingCosts),
      importDuties: Math.round(importDuties),
      totalLandedCost: Math.round(totalLandedCost),
      vatOnLandedCost: Math.round(vatOnLandedCost),
      desiredProfit: Math.round(desiredProfit),
      additionalVAT: Math.round(additionalVAT),
      totalCosts: Math.round(totalCosts),
      finalSalePrice: Math.round(finalSalePrice),
      finalProfit: Math.round(finalProfit),
    };
  }, [initialPrice, shippingCosts, profitPercentage, isEU]);

  const formatCurrency = (value) => {
    if (isNaN(value)) return '€ 0';
    // Using 'de-DE' locale for dot as thousand separator
    return `€ ${value.toLocaleString('de-DE')}`;
  };

  const ResultRow = ({ label, value, isBold = false, isFinal = false }) => (
    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
      <Grid item>
        <Typography variant={isFinal ? "h6" : "body1"} sx={{ fontWeight: isBold ? 'bold' : 'normal' }}>
          {label}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant={isFinal ? "h6" : "body1"} sx={{ fontWeight: isBold ? 'bold' : 'normal' }}>
          {formatCurrency(value)}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4} justifyContent="center">

          {/* --- Input Section --- */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Calculator Inputs
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  label="Car's Initial Price (€)"
                  variant="outlined"
                  type="number"
                  value={initialPrice}
                  onChange={(e) => setInitialPrice(e.target.value)}
                  sx={{ mb: 2.5 }}
                />
                <TextField
                  fullWidth
                  label="Desired Profit Percentage (%)"
                  variant="outlined"
                  type="number"
                  value={profitPercentage}
                  onChange={(e) => setProfitPercentage(e.target.value)}
                  sx={{ mb: 2.5 }}
                />
                <TextField
                  fullWidth
                  label="Shipping Costs (€)"
                  variant="outlined"
                  type="number"
                  value={shippingCosts}
                  onChange={(e) => setShippingCosts(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isEU}
                      onChange={(e) => setIsEU(e.target.checked)}
                      name="isEUCar"
                      color="primary"
                    />
                  }
                  label="Car is manufactured in the EU (No import duties)"
                />
              </Box>
            </Paper>
          </Grid>

          {/* --- Results Section --- */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Icon color="primary" sx={{ mr: 1.5 }}>
                  <EuroSymbolIcon fontSize="large" />
                </Icon>
                <Typography variant="h4" component="h2">
                  Financial Breakdown
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* Cost Breakdown */}
              <Typography variant="h6" color="text.secondary" gutterBottom>COSTS</Typography>
              <ResultRow label="Initial Car Price" value={calculations.initialPrice} />
              <ResultRow label="Shipping Costs" value={calculations.shippingCosts} />
              <ResultRow label="Import Duties (10%)" value={calculations.importDuties} />
              <Divider sx={{ my: 1.5 }} light/>
              <ResultRow label="Total Landed Cost" value={calculations.totalLandedCost} isBold />
              <ResultRow label="VAT on Landed Cost (19%)" value={calculations.vatOnLandedCost} />
              <ResultRow label="Additional VAT on Profit (19%)" value={calculations.additionalVAT} />
              <Divider sx={{ my: 1.5 }} />
              <ResultRow label="Total Costs" value={calculations.totalCosts} isFinal />

              {/* Pricing & Profit Breakdown */}
              <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }} gutterBottom>PRICING & PROFIT</Typography>
              <ResultRow label="Desired Profit" value={calculations.desiredProfit} />
              <Divider sx={{ my: 1.5 }}/>
              <ResultRow label="Required Sale Price" value={calculations.finalSalePrice} isFinal />
              <ResultRow label="Final Profit" value={calculations.finalProfit} isFinal />
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
