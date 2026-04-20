import { EXCHANGE_RATE_PROVIDERS } from './hooks';
import { DEFAULT_SHIPPING_COST, FUEL_TYPES, IMPORT_LOCATION } from './constants';

const QUERY_KEYS = {
  initialPrice: 'price',
  profitPercentage: 'profit',
  shippingCosts: 'shipping',
  emissions: 'emissions',
  fuelType: 'fuel',
  japanMade: 'japanMade',
  ukMade: 'ukMade',
  isVATQualified: 'vatQualified',
  includeAuctionFees: 'auctionFees',
  importLocation: 'import',
  currency: 'currency',
  isAntique: 'antique',
  exchangeRateProvider: 'rateProvider',
};

const DEFAULT_OPTIONS = {
  initialPrice: '',
  profitPercentage: '8',
  shippingCosts: DEFAULT_SHIPPING_COST.toString(),
  emissions: '0',
  fuelType: FUEL_TYPES.PETROL.value,
  japanMade: true,
  ukMade: false,
  isVATQualified: false,
  includeAuctionFees: false,
  importLocation: IMPORT_LOCATION.JAPAN,
  currency: 'EUR',
  isAntique: false,
  exchangeRateProvider: EXCHANGE_RATE_PROVIDERS.EXCHANGERATE_API,
};

const ALLOWED_CURRENCIES = new Set(['EUR', 'GBP', 'JPY']);
const ALLOWED_IMPORT_LOCATIONS = new Set(Object.values(IMPORT_LOCATION));
const ALLOWED_FUEL_TYPES = new Set(Object.values(FUEL_TYPES).map((fuel) => fuel.value));
const ALLOWED_RATE_PROVIDERS = new Set(Object.values(EXCHANGE_RATE_PROVIDERS));

const toBoolean = (value, fallback) => {
  if (value === null) return fallback;
  return value === '1' || value === 'true';
};

const toStringNumber = (value, fallback) => {
  if (!value) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? value : fallback;
};

export function getInitialOptionsFromUrl() {
  if (typeof window === 'undefined') {
    return DEFAULT_OPTIONS;
  }

  const params = new URLSearchParams(window.location.search);
  const currency = params.get(QUERY_KEYS.currency);
  const importLocation = params.get(QUERY_KEYS.importLocation);
  const fuelType = params.get(QUERY_KEYS.fuelType);
  const exchangeRateProvider = params.get(QUERY_KEYS.exchangeRateProvider);

  return {
    initialPrice: params.get(QUERY_KEYS.initialPrice) ?? DEFAULT_OPTIONS.initialPrice,
    profitPercentage: toStringNumber(
      params.get(QUERY_KEYS.profitPercentage),
      DEFAULT_OPTIONS.profitPercentage
    ),
    shippingCosts: toStringNumber(
      params.get(QUERY_KEYS.shippingCosts),
      DEFAULT_OPTIONS.shippingCosts
    ),
    emissions: toStringNumber(params.get(QUERY_KEYS.emissions), DEFAULT_OPTIONS.emissions),
    fuelType: ALLOWED_FUEL_TYPES.has(fuelType) ? fuelType : DEFAULT_OPTIONS.fuelType,
    japanMade: toBoolean(params.get(QUERY_KEYS.japanMade), DEFAULT_OPTIONS.japanMade),
    ukMade: toBoolean(params.get(QUERY_KEYS.ukMade), DEFAULT_OPTIONS.ukMade),
    isVATQualified: toBoolean(
      params.get(QUERY_KEYS.isVATQualified),
      DEFAULT_OPTIONS.isVATQualified
    ),
    includeAuctionFees: toBoolean(
      params.get(QUERY_KEYS.includeAuctionFees),
      DEFAULT_OPTIONS.includeAuctionFees
    ),
    importLocation: ALLOWED_IMPORT_LOCATIONS.has(importLocation)
      ? importLocation
      : DEFAULT_OPTIONS.importLocation,
    currency: ALLOWED_CURRENCIES.has(currency) ? currency : DEFAULT_OPTIONS.currency,
    isAntique: toBoolean(params.get(QUERY_KEYS.isAntique), DEFAULT_OPTIONS.isAntique),
    exchangeRateProvider: ALLOWED_RATE_PROVIDERS.has(exchangeRateProvider)
      ? exchangeRateProvider
      : DEFAULT_OPTIONS.exchangeRateProvider,
  };
}

export function syncOptionsToUrl(options) {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);

  params.set(QUERY_KEYS.initialPrice, options.initialPrice);
  params.set(QUERY_KEYS.profitPercentage, options.profitPercentage);
  params.set(QUERY_KEYS.shippingCosts, options.shippingCosts);
  params.set(QUERY_KEYS.emissions, options.emissions);
  params.set(QUERY_KEYS.fuelType, options.fuelType);
  params.set(QUERY_KEYS.japanMade, options.japanMade ? '1' : '0');
  params.set(QUERY_KEYS.ukMade, options.ukMade ? '1' : '0');
  params.set(QUERY_KEYS.isVATQualified, options.isVATQualified ? '1' : '0');
  params.set(QUERY_KEYS.includeAuctionFees, options.includeAuctionFees ? '1' : '0');
  params.set(QUERY_KEYS.importLocation, options.importLocation);
  params.set(QUERY_KEYS.currency, options.currency);
  params.set(QUERY_KEYS.isAntique, options.isAntique ? '1' : '0');
  params.set(QUERY_KEYS.exchangeRateProvider, options.exchangeRateProvider);

  const nextQuery = params.toString();
  const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`;
  window.history.replaceState({}, '', nextUrl);
}
