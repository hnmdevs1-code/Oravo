import { Suspense } from 'react';
import SetupPage from './SetupPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetupPage />
    </Suspense>
  );
}