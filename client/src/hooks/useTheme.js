import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../store/slices/uiSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  return {
    darkMode,
    toggleTheme: () => dispatch(toggleDarkMode()),
  };
};
