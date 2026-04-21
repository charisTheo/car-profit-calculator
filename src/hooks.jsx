import { useState, useEffect } from "react";

export const EXCHANGE_RATE_PROVIDERS = {
  EUROBANK: "eurobank",
  EXCHANGERATE_API: "exchangerate-api",
};

const getTodayInExchangeRateDateFormat = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  return `${day}/${month}/${year}`;
};

const fetchRatesFromExchangeRateAPI = async ({ from, to }) => {
  try {
    // Using exchangerate-api.com free tier (no API key needed for basic usage)
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`,
    );
    const data = await response.json();
    return data?.rates?.[to] || 1;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Fallback to approximate rates if API fails
    return 1;
  }
};

const fetchRatesFromEurobank = async ({ from, to }) => {
  try {
    const body = JSON.stringify({
      currencyFrom: from,
      currencyTo: to,
    });

    const response = await fetch(
      `https://3n4jvs3ouj3x3xkgjx46la75ve0oszff.lambda-url.eu-west-2.on.aws/?secret=afekjf902330QJR]QR0Q3&url=https://www.eurobank.cy/api/Calculators/exchangeFetchData`,
      {
        method: "POST",
        body,
      },
    );

    const data = await response.json();
    const today = getTodayInExchangeRateDateFormat();
    const rate = data.rates.filter((rate) => rate.exchangeRateDate === today);
    return rate.transfersRates.buy;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return 1;
  }
};

export const useExchangeRate = (provider, { from, to }) => {
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    if (!from || !to || from === to) {
      setExchangeRate(1);
      return;
    }

    const fetchRates = async () => {
      if (provider === EXCHANGE_RATE_PROVIDERS.EUROBANK) {
        const rate = await fetchRatesFromEurobank({ from, to });
        setExchangeRate(rate);
      } else if (provider === EXCHANGE_RATE_PROVIDERS.EXCHANGERATE_API) {
        const rate = await fetchRatesFromExchangeRateAPI({ from, to });
        setExchangeRate(rate);
      }
    };

    fetchRates();
  }, [provider, from, to]);

  return exchangeRate;
};
