import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { SocketProvider } from './context/SocketContext';
import { initializeTheme } from './store/slices/uiSlice';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { checkAuth } = useAuth();
  const isAuthChecked = useRef(false);

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthChecked.current) {
      isAuthChecked.current = true;
      checkAuth();
    }
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <SocketProvider isAuthenticated={isAuthenticated}>
        <AppRoutes />
      </SocketProvider>
    </ErrorBoundary>
  );
}
