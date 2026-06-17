'use client';

import { useState } from 'react';
import LandingPage from '../components/common/LandingPage';

export default function Page() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <LandingPage
      showWelcome={showWelcome}
      setShowWelcome={setShowWelcome}
    />
  );
}
