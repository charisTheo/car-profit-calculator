export const formatCurrency = (value) => {
  if (isNaN(value)) return '€ 0';
  // Using 'de-DE' locale for dot as thousand separator
  return `€ ${value.toLocaleString('de-DE')}`;
};
