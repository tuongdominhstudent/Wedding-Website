import { useAppBootstrap } from '../../hooks/useAppBootstrap';

function AppProviders({ children }) {
  useAppBootstrap();
  return children;
}

export default AppProviders;
