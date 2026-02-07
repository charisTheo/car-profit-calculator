import React, { useState, useMemo, useEffect } from 'react';
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
  Button,
  ButtonGroup,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';

const UK_VAT_RATE = 0.20;
const CY_VAT_RATE = 0.19;
const IMPORT_DUTY_RATE = 0.10;
const MAXIMUM_EMISSIONS_TAX = 1500;
const REGISTRATION_FEE = 150;
const DEFAULT_SHIPPING_COST = 1500;

const IMPORT_LOCATION = {
  JAPAN: 'japan',
  UK: 'uk',
  EU: 'eu',
}

const FUEL_TYPES = {
  PETROL: {
    value: 'petrol',
    label: 'Petrol',
  },
  DIESEL: {
    value: 'diesel',
    label: 'Diesel',
  },
  ELECTRIC: {
    value: 'electric',
    label: 'Electric',
  },
}

// TODO Επιπρόσθετα για βενζινοκίνητα οχήματα με EURO standard 5a θα υπάρχει επιπρόσθετο τέλος 100 Ευρώ και για  EURO standard 4 και πιο παλαιό, 300 Ευρώ επιπρόσθετο τέλος. Για πετρελαιοκίνητα οχήματα με EURO standard 5b θα υπάρχει επιπρόσθετο τέλος 50 Ευρώ, για EURO standard 5a θα υπάρχει επιπρόσθετο τέλος 250 Ευρώ και για  EURO standard 4 και πιο παλαιό, 600 Ευρώ επιπρόσθετο τέλος.
const calculateEmissionsCost = (emissions) => {
  let remainingEmissions = emissions;
  let emissionsCost = 0;

  while (remainingEmissions > 0) {
    if (remainingEmissions >= 181) {
      emissionsCost += (remainingEmissions - 180) * 10;
      remainingEmissions = 180;
    } else if (remainingEmissions >= 151) {
      emissionsCost += (remainingEmissions - 150) * 5;
      remainingEmissions = 150;
    } else if (remainingEmissions >= 121) {
      emissionsCost += (remainingEmissions - 120) * 3;
      remainingEmissions = 120;
    } else {
      emissionsCost += remainingEmissions * 0.5;
      remainingEmissions = 0;
    }
  }

  return Math.min(emissionsCost, MAXIMUM_EMISSIONS_TAX);
};

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
  const [profitPercentage, setProfitPercentage] = useState('8');
  const [shippingCosts, setShippingCosts] = useState(DEFAULT_SHIPPING_COST.toString());
  const [emissions, setEmissions] = useState('0');
  const [fuelType, setFuelType] = useState(FUEL_TYPES.PETROL.value);
  const [japanMade, setJapanMade] = useState(true);
  const [isVATQualified, setIsVATQualified] = useState(false);
  const [includeAuctionFees, setIncludeAuctionFees] = useState(false);
  const [importLocation, setImportLocation] = useState(IMPORT_LOCATION.JAPAN);
  const [currency, setCurrency] = useState('EUR');
  const [convertedPrice, setConvertedPrice] = useState('');
  const [exchangeRate, setExchangeRate] = useState({ GBP: 1, JPY: 1 });

  // Fetch exchange rates from API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // Using exchangerate-api.com free tier (no API key needed for basic usage)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await response.json();
        if (data.rates) {
          setExchangeRate({
            GBP: data.rates.GBP || 1,
            JPY: data.rates.JPY || 1,
          });
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Fallback to approximate rates if API fails
        setExchangeRate({
          GBP: 0.85,
          JPY: 160,
        });
      }
    };

    fetchExchangeRates();
  }, []);

  // Convert price to EUR when currency or initialPrice changes
  useEffect(() => {
    const parsedPrice = Number(initialPrice) || 0;
    if (currency === 'EUR') {
      setConvertedPrice(parsedPrice.toString());
    } else if (currency === 'GBP') {
      // Convert GBP to EUR: divide by GBP rate (since rate is GBP per EUR)
      const eurPrice = parsedPrice / exchangeRate.GBP;
      setConvertedPrice(eurPrice.toString());
    } else if (currency === 'JPY') {
      // Convert JPY to EUR: divide by JPY rate (since rate is JPY per EUR)
      const eurPrice = parsedPrice / exchangeRate.JPY;
      setConvertedPrice(eurPrice.toString());
    }
  }, [initialPrice, currency, exchangeRate]);

  const calculations = useMemo(() => {
    const parsedEmissions = Number(emissions) || 0;
    const parsedInitialPrice = Number(convertedPrice) || 0;
    const parsedShippingCosts = Number(shippingCosts) || 0;
    const parsedProfitPercentage = Number(profitPercentage) || 0;

    // Auction Fees Calculation
    let auctionFee = 0;
    if (includeAuctionFees && importLocation === IMPORT_LOCATION.JAPAN) {
      const priceInJPY = currency === 'JPY' ? Number(initialPrice) || 0 : parsedInitialPrice * exchangeRate.JPY;
      let feeInJPY = 0;

      if (priceInJPY <= 800000) feeInJPY = 75000;
      else if (priceInJPY <= 1500000) feeInJPY = 85000;
      else if (priceInJPY <= 1999999) feeInJPY = 95000;
      else if (priceInJPY <= 2999999) feeInJPY = 110000;
      else if (priceInJPY <= 3999999) feeInJPY = 135000;
      else if (priceInJPY <= 4999999) feeInJPY = 160000;
      else if (priceInJPY <= 6000000) feeInJPY = priceInJPY * 0.05;
      else if (priceInJPY <= 7000000) feeInJPY = priceInJPY * 0.06;
      else if (priceInJPY <= 8000000) feeInJPY = priceInJPY * 0.07;
      else if (priceInJPY <= 9000000) feeInJPY = priceInJPY * 0.08;
      else feeInJPY = priceInJPY * 0.09;

      auctionFee = feeInJPY / exchangeRate.JPY;
    }

    const ukReturnedVAT = isVATQualified && importLocation === IMPORT_LOCATION.UK ? UK_VAT_RATE * parsedInitialPrice : 0;
    const importDutyRate = importLocation === IMPORT_LOCATION.JAPAN && !japanMade ? IMPORT_DUTY_RATE : 0;
    const importDuties = importDutyRate > 0 ? parsedInitialPrice * importDutyRate : 0;
    const emissionsCost = calculateEmissionsCost(parsedEmissions);
    const totalLandedCost = parsedInitialPrice + parsedShippingCosts + importDuties + REGISTRATION_FEE + emissionsCost - ukReturnedVAT + auctionFee;
    const vatOnLandedCost = totalLandedCost * CY_VAT_RATE;
    const profit = parsedInitialPrice * (parsedProfitPercentage / 100);

    // This formula finds the sale price needed to achieve the profit
    // after accounting for the VAT on that profit.
    const finalSalePrice = (parsedInitialPrice > 0 && parsedProfitPercentage > 0)
        ? (totalLandedCost + profit) * (1 + CY_VAT_RATE)
        : 0;

    const additionalVAT = profit * CY_VAT_RATE;
    const totalCosts = totalLandedCost + vatOnLandedCost + additionalVAT;
    const finalProfit = finalSalePrice - totalCosts;

    // Return all values, rounded to the nearest integer
    return {
      initialPrice: Math.round(parsedInitialPrice),
      auctionFee: Math.round(auctionFee),
      importDutyRate: importDutyRate,
      shippingCosts: Math.round(parsedShippingCosts),
      importDuties: Math.round(importDuties),
      emissionsCost: Math.round(emissionsCost),
      totalLandedCost: Math.round(totalLandedCost),
      vatOnLandedCost: Math.round(vatOnLandedCost),
      profit: Math.round(profit),
      additionalVAT: Math.round(additionalVAT),
      totalCosts: Math.round(totalCosts),
      finalSalePrice: Math.round(finalSalePrice),
      finalProfit: Math.round(finalProfit),
      ukReturnedVAT: Math.round(ukReturnedVAT),
    };
  }, [convertedPrice, shippingCosts, profitPercentage, japanMade, isVATQualified, emissions, includeAuctionFees, importLocation, exchangeRate]);

  const formatCurrency = (value) => {
    if (isNaN(value)) return '€ 0';
    // Using 'de-DE' locale for dot as thousand separator
    return `€ ${value.toLocaleString('de-DE')}`;
  };

  const ResultRow = ({ label, value, isBold = false, isHighlighted = false, isFinal = false }) => (
    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
      <Grid item>
        <Typography variant={isFinal ? "h6" : "body1"} sx={{ fontWeight: isBold ? 'bold' : 'normal' }}>
          {label}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant={isFinal ? "h6" : "body1"} sx={{ fontWeight: isBold ? 'bold' : 'normal', color: isHighlighted ? 'success.main' : 'text.primary' }}>
          {formatCurrency(value)}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="none" sx={{ py: 4 }}>
        <Grid container spacing={4} justifyContent="center">

          {/* --- Input Section --- */}
          <Grid size={{xs: 12, md: 5}}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Box component="form" noValidate autoComplete="off">
                <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
                  <FormLabel component="legend">Currency</FormLabel>
                  <RadioGroup
                    row
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <FormControlLabel value="EUR" control={<Radio />} label="EUR (€)" />
                    <FormControlLabel value="GBP" control={<Radio />} label="GBP (£)" />
                    <FormControlLabel value="JPY" control={<Radio />} label="JPY (¥)" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  fullWidth
                  label={`Car's Initial Price (${currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'})`}
                  variant="outlined"
                  type="number"
                  value={initialPrice}
                  onChange={(e) => setInitialPrice(e.target.value)}
                  sx={{ mb: 2 }}
                  helperText={currency !== 'EUR' && convertedPrice ? `≈ €${Number(convertedPrice).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                />
                <TextField
                  fullWidth
                  label="Profit (%)"
                  variant="outlined"
                  type="number"
                  value={profitPercentage}
                  onChange={(e) => setProfitPercentage(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ mb: 2 }}>
                  <ButtonGroup variant="outlined" size="small" fullWidth>
                    <Button
                      onClick={() => setProfitPercentage('5')}
                      variant={profitPercentage === '5' ? 'contained' : 'outlined'}
                    >
                      5%
                    </Button>
                    <Button
                      onClick={() => setProfitPercentage('8')}
                      variant={profitPercentage === '8' ? 'contained' : 'outlined'}
                    >
                      8%
                    </Button>
                    <Button
                      onClick={() => setProfitPercentage('10')}
                      variant={profitPercentage === '10' ? 'contained' : 'outlined'}
                    >
                      10%
                    </Button>
                  </ButtonGroup>
                </Box>

                <TextField
                  fullWidth
                  label="Shipping Costs (€)"
                  variant="outlined"
                  type="number"
                  value={shippingCosts}
                  onChange={(e) => setShippingCosts(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <FormControl component="fieldset" sx={{ mb: 1, width: '100%' }}>
                  <FormLabel component="legend">Fuel Type</FormLabel>
                  <RadioGroup
                    row
                    value={fuelType}
                    onChange={(e) => {
                      const newFuelType = e.target.value;
                      setFuelType(newFuelType)
                      if (newFuelType === FUEL_TYPES.ELECTRIC.value) {
                        setEmissions("0");
                      }
                    }}
                  >
                    <FormControlLabel value={FUEL_TYPES.PETROL.value} control={<Radio />} label={FUEL_TYPES.PETROL.label} />
                  <FormControlLabel value={FUEL_TYPES.DIESEL.value} control={<Radio />} label={FUEL_TYPES.DIESEL.label} />
                  <FormControlLabel value={FUEL_TYPES.ELECTRIC.value} control={<Radio />} label={FUEL_TYPES.ELECTRIC.label} />
                  </RadioGroup>
                </FormControl>

                {fuelType !== FUEL_TYPES.ELECTRIC.value && (
                  <>
                    <TextField
                      fullWidth
                      label={<span>CO<sup>2</sup> Emissions (g/km)</span>}
                      variant="outlined"
                      type="number"
                      value={emissions}
                      onChange={(e) => setEmissions(e.target.value)}
                      sx={{ mb: 1 }}
                    />

                    <Box sx={{ mb: 2 }}>
                      <ButtonGroup variant="outlined" size="small" fullWidth sx={{ '& .MuiButton-root': { textTransform: 'none' } }}>
                        <Button
                          onClick={() => setEmissions('120')}
                          variant={emissions === '120' ? 'contained' : 'outlined'}
                        >
                          120 g/km
                        </Button>
                        <Button
                          onClick={() => setEmissions('180')}
                          variant={emissions === '180' ? 'contained' : 'outlined'}
                        >
                          180 g/km
                        </Button>
                        <Button
                          onClick={() => setEmissions('230')}
                          variant={emissions === '230' ? 'contained' : 'outlined'}
                        >
                          230 g/km
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </>
                )}


            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>Import location</Typography>
              <ButtonGroup sx={{ '& .MuiButton-root': { textTransform: 'none' } }}>
                <Button
                  onClick={() => setImportLocation(IMPORT_LOCATION.JAPAN)}
                  variant={importLocation === IMPORT_LOCATION.JAPAN ? 'contained' : 'outlined'}
                >
                  🇯🇵
                </Button>
                <Button
                  onClick={() => setImportLocation(IMPORT_LOCATION.UK)}
                  variant={importLocation === IMPORT_LOCATION.UK ? 'contained' : 'outlined'}
                >
                  🇬🇧
                </Button>
                <Button
                  onClick={() => setImportLocation(IMPORT_LOCATION.EU)}
                  variant={importLocation === IMPORT_LOCATION.EU ? 'contained' : 'outlined'}
                >
                  🇪🇺
                </Button>
              </ButtonGroup>
            </Box>

              {importLocation === IMPORT_LOCATION.JAPAN && (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={japanMade}
                        onChange={(e) => setJapanMade(e.target.checked)}
                        name="japanMade"
                        color="primary"
                      />
                    }
                    label="Japan-made 🇯🇵"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeAuctionFees}
                        onChange={(e) => setIncludeAuctionFees(e.target.checked)}
                        name="includeAuctionFees"
                        color="primary"
                      />
                    }
                    label="Auction Fees 🇯🇵"
                  />
                  </>
                )}

                {importLocation === IMPORT_LOCATION.UK && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isVATQualified}
                        onChange={(e) => setIsVATQualified(e.target.checked)}
                        name="isVATQualified"
                        color="primary"
                      />
                    }
                    label="VAT Q 🇬🇧"
                  />
                )}
              </Box>
            </Paper>
          </Grid>

          {/* --- Results Section --- */}
          <Grid size={{xs: 12, md: 7}}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Icon fontSize="large" color="primary" sx={{ mr: 1 }}>
                  <EuroSymbolIcon sx={{ verticalAlign: 'text-top' }} />
                </Icon>
                <Typography variant="h4" component="h2">
                  Financial Breakdown
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Cost Breakdown */}
              <Typography variant="h6" color="text.secondary" gutterBottom>COSTS</Typography>
              <ResultRow label="Initial Car Price" value={calculations.initialPrice} />
              {calculations.ukReturnedVAT > 0 && (
                <ResultRow label="UK Returned VAT (20%)" value={calculations.ukReturnedVAT} />
              )}
              <ResultRow label="Shipping Costs" value={calculations.shippingCosts} />
              <ResultRow label={`Import Duties (${calculations.importDutyRate * 100}%)`} value={calculations.importDuties} />
              {calculations.auctionFee > 0 && (
                <ResultRow label="Auction Fees" value={calculations.auctionFee} />
              )}
              <ResultRow label="Registration Fee" value={REGISTRATION_FEE} />
              <ResultRow label="Road Tax" value={calculations.emissionsCost} />
              <Divider sx={{ my: 1.5 }} light/>
              <ResultRow label="Total Landed Cost" value={calculations.totalLandedCost} isBold />
              <ResultRow label={`VAT on Landed Cost (${calculations.totalLandedCost} x ${CY_VAT_RATE * 100}%)`} value={calculations.vatOnLandedCost} />
              <ResultRow label={`Additional VAT on Profit (${calculations.profit} x ${CY_VAT_RATE * 100}%)`} value={calculations.additionalVAT} />
              <Divider sx={{ my: 1.5 }} />
              <ResultRow label="Total Costs" value={calculations.totalCosts} isFinal isHighlighted />

              {/* Pricing & Profit Breakdown */}
              <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }} gutterBottom>PRICING & PROFIT</Typography>
              <ResultRow label="Profit" value={calculations.profit} />
              <Divider sx={{ my: 1.5 }}/>
              <ResultRow label="Required Sale Price" value={calculations.finalSalePrice} isFinal isHighlighted />
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
