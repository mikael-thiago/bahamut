export const useCurrencyFormatter = () => {
  const formatter = new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return { formatter };
};
