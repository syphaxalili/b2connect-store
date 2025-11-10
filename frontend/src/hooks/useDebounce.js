import { useState, useEffect } from 'react';

/**
 * Hook pour "debouncer" une valeur
 * @param {any} value - La valeur à debouncer
 * @param {number} delay - Le délai en millisecondes (par défaut 500ms)
 * @returns {any} La valeur debouncée
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Mettre à jour la valeur "debounced" après le délai
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Annuler le timeout si la valeur change (l'utilisateur tape encore)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
