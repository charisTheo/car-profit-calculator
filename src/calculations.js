import {
  CY_VAT_RATE,
  IMPORT_DUTY_RATE,
  IMPORT_LOCATION,
  MAXIMUM_EMISSIONS_TAX,
  REGISTRATION_FEE,
  UK_VAT_RATE,
} from './constants';

/** Eurobank / Hellenic Bank — Table of Commissions and Charges EN, effective 03.11.2025.
 * Outgoing Payments in Foreign Currency: debiting a different currency than the payment
 * (e.g. EUR -> JPY or EUR -> GBP) uses "Debit account in different currency (additional charge)":
 * 0.30%, min EUR6, max EUR500.
 * (0.15% min EUR15 max EUR350 applies when the debited account is in the same currency as the payment.) */
export function calculateEurobankOutgoingForeignFromEurFee(eurAmount) {
  if (!eurAmount || eurAmount <= 0) return 0;
  return Math.min(500, Math.max(6, eurAmount * 0.003));
}

// TODO Additional emissions surcharges based on EURO standards.
export const calculateEmissionsCost = (emissions) => {
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

export function calculateFinancials({
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
  importLocation,
  isAntique,
  japaneseExchangeRate,
}) {
  const parsedEmissions = Number(emissions) || 0;
  const parsedInitialPrice = Number(convertedPrice) || 0;
  const parsedShippingCosts = Number(shippingCosts) || 0;
  const parsedProfitPercentage = Number(profitPercentage) || 0;

  let auctionFee = 0;
  if (includeAuctionFees && importLocation === IMPORT_LOCATION.JAPAN) {
    const priceInJPY =
      currency === 'JPY' ? Number(initialPrice) || 0 : parsedInitialPrice / japaneseExchangeRate;
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

    auctionFee = feeInJPY * japaneseExchangeRate;
  }

  const isJapanTransfer = importLocation === IMPORT_LOCATION.JAPAN;
  const isUkGbpTransfer = importLocation === IMPORT_LOCATION.UK;
  const transferAmountEur = isJapanTransfer ? parsedInitialPrice + auctionFee : parsedInitialPrice;
  const bankTransferFees =
    isJapanTransfer || isUkGbpTransfer
      ? calculateEurobankOutgoingForeignFromEurFee(transferAmountEur)
      : 0;

  const ukReturnedVAT =
    isVATQualified && importLocation === IMPORT_LOCATION.UK ? UK_VAT_RATE * parsedInitialPrice : 0;

  let importDutyRate = 0;
  if (isAntique) {
    importDutyRate = 0;
  } else if (importLocation === IMPORT_LOCATION.JAPAN && !japanMade) {
    importDutyRate = IMPORT_DUTY_RATE;
  } else if (importLocation === IMPORT_LOCATION.UK && !ukMade) {
    importDutyRate = IMPORT_DUTY_RATE;
  }

  const importDuties = importDutyRate > 0 ? parsedInitialPrice * importDutyRate : 0;
  const emissionsCost = calculateEmissionsCost(parsedEmissions);
  const totalLandedCost =
    parsedInitialPrice +
    parsedShippingCosts +
    importDuties +
    REGISTRATION_FEE +
    emissionsCost -
    ukReturnedVAT +
    auctionFee +
    bankTransferFees;
  const vatOnLandedCost = totalLandedCost * CY_VAT_RATE;
  const profit = parsedInitialPrice * (parsedProfitPercentage / 100);
  const finalSalePrice =
    parsedInitialPrice > 0 && parsedProfitPercentage > 0 ? (totalLandedCost + profit) * (1 + CY_VAT_RATE) : 0;

  const additionalVAT = profit * CY_VAT_RATE;
  const totalCosts = totalLandedCost + vatOnLandedCost + additionalVAT;
  const finalProfit = finalSalePrice - totalCosts;

  return {
    initialPrice: Math.round(parsedInitialPrice),
    auctionFee: Math.round(auctionFee),
    bankTransferFees: Math.round(bankTransferFees),
    importDutyRate,
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
}
