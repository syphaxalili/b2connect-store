import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material';

const GlobalLoadingModal = () => {
  // Écouter l'état centralisé
  const requestCount = useSelector((state) => state.loading.requestCount);
  const isLoading = requestCount > 0;

  return (
    <Backdrop
      sx={{
        color: '#fff',
        // Le z-index doit être très élevé (au-dessus des modaux MUI par défaut)
        zIndex: (theme) => theme.zIndex.drawer + 999,
        // Backdrop complètement opaque pour cacher tout le contenu
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
      open={isLoading}
      // Ne pas fermer au clic
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export default GlobalLoadingModal;
