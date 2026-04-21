export const JAPANESE_AUCTION_SITES = {
  AUTO_FROM_AUCTION: 'AUTO_FROM_AUCTION',
  NIKKYO: 'NIKKYO',
};

// TODO
// const INSURANCE_FEES_PERCENTAGE_OF_VEHICLE_COST = {
//   [JAPANESE_AUCTION_SITES.AUTO_FROM_AUCTION]: 1.3,
//   [JAPANESE_AUCTION_SITES.NIKKYO]: 1.3,
// }

const DOCUMENTATION_FEES = {
  // TODO
  [JAPANESE_AUCTION_SITES.AUTO_FROM_AUCTION]: 5000,
  [JAPANESE_AUCTION_SITES.NIKKYO]: 5000,
}

// between 10,000 and 30,000 JPY. Using maximum to be safe.
const TRANSPORTATION_FEES = {
  [JAPANESE_AUCTION_SITES.AUTO_FROM_AUCTION]: 30000,
  [JAPANESE_AUCTION_SITES.NIKKYO]: 30000,
}

export function getAutoFromAuctionServiceFeeJPY(vehicleCostJPY) {
  const priceInJPY = Number(vehicleCostJPY) || 0;
  let serviceFeeJPY = 0;

  if (priceInJPY <= 0) {
    return {
      serviceFeeJPY: 0,
      documentationFeeJPY: DOCUMENTATION_FEES[JAPANESE_AUCTION_SITES.AUTO_FROM_AUCTION],
      transportationFeeJPY: TRANSPORTATION_FEES[JAPANESE_AUCTION_SITES.AUTO_FROM_AUCTION],
    }
  };

  if (priceInJPY <= 800000) serviceFeeJPY = 75000;
  if (priceInJPY <= 1500000) serviceFeeJPY = 85000;
  if (priceInJPY <= 1999999) serviceFeeJPY = 95000;
  if (priceInJPY <= 2999999) serviceFeeJPY = 110000;
  if (priceInJPY <= 3999999) serviceFeeJPY = 135000;
  if (priceInJPY <= 4999999) serviceFeeJPY = 160000;
  if (priceInJPY <= 6000000) serviceFeeJPY = priceInJPY * 0.05;
  if (priceInJPY <= 7000000) serviceFeeJPY = priceInJPY * 0.06;
  if (priceInJPY <= 8000000) serviceFeeJPY = priceInJPY * 0.07;
  if (priceInJPY <= 9000000) serviceFeeJPY = priceInJPY * 0.08;

  return {
    serviceFeeJPY,
    documentationFeeJPY: DOCUMENTATION_FEES[JAPANESE_AUCTION_SITES.AUTO_FROM_AUCTION],
    transportationFeeJPY: TRANSPORTATION_FEES[JAPANESE_AUCTION_SITES.AUTO_FROM_AUCTION],
  };
}

export function getNikkyoFeesJPY(vehicleCostJPY) {
  const priceInJPY = Number(vehicleCostJPY) || 0;

  let serviceFeeJPY = 0;
  if (priceInJPY > 0 && priceInJPY <= 3000000) {
    serviceFeeJPY = 100000;
  } else if (priceInJPY > 3000000) {
    serviceFeeJPY = priceInJPY * 0.04;
  }

  return {
    serviceFeeJPY,
    documentationFeeJPY: DOCUMENTATION_FEES[JAPANESE_AUCTION_SITES.NIKKYO],
    transportationFeeJPY: TRANSPORTATION_FEES[JAPANESE_AUCTION_SITES.NIKKYO],
  };
}

/**
 * Returns the auction fees breakdown for a given auction site and vehicle cost in JPY.
 * @param {string} auctionSite - The auction site to get the fees for.
 * @param {number} vehicleCostJPY - The vehicle cost in JPY.
 * @returns {AuctionFeesBreakdown} The auction fees breakdown.
 *
 * @ObjectType {AuctionFeesBreakdown}
 * @property {number} serviceFeeJPY - The service fee in JPY.
 * @property {number} documentationFeeJPY - The documentation fee in JPY.
 * @property {number} transportationFeeJPY - The transportation fee in JPY.
 */
export function getJapaneseAuctionFeeBreakdownBySiteJPY(auctionSite, vehicleCostJPY) {
  let fees = {}

  if (auctionSite === JAPANESE_AUCTION_SITES.NIKKYO) {
    fees = getNikkyoFeesJPY(vehicleCostJPY);
  } else {
    fees = getAutoFromAuctionServiceFeeJPY(vehicleCostJPY);
  }

  return fees;
}
