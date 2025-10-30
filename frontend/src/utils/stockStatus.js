/**
 * Détermine le statut du stock basé sur la quantité disponible
 * @param {number} stock - Quantité en stock
 * @returns {object} - { status: string, label: string, color: string }
 */
export const getStockStatus = (stock) => {
  const LOW_STOCK_THRESHOLD = 5;

  if (stock === 0) {
    return {
      status: "out_of_stock",
      label: "Épuisé",
      color: "error"
    };
  } else if (stock <= LOW_STOCK_THRESHOLD) {
    return {
      status: "low_stock",
      label: "Il en reste quelques-unes",
      color: "warning"
    };
  } else {
    return {
      status: "available",
      label: "Disponible",
      color: "success"
    };
  }
};
