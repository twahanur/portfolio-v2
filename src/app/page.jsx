'use client';

import { usePortfolio } from '../context/PortfolioContext';
import LandingPage from '../components/common/LandingPage';

export default function Page() {
  const { showWelcome, setShowWelcome } = usePortfolio();

  return (
    <LandingPage
      showWelcome={showWelcome}
      setShowWelcome={setShowWelcome}
    />
  );
}
