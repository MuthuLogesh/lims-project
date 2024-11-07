import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy-loaded components with types
const LaboratoryList = lazy(() => import('../pages/LaboratoryList/LaboratoryList'));
const LaboratoryDetails = lazy(() => import('../pages/LaboratoryDetails/LaboratoryDetails'));

// Type for the route params
// interface LaboratoryDetailsParams {
//   id: string;
// }

// Loading Spinner component for Suspense fallback
const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <span>Loading...</span>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LaboratoryList />} />
          <Route
            path="/laboratoryDetails/:id"
            element={<LaboratoryDetails />}
          />
          <Route path="/createlaboratory" element={<LaboratoryDetails />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
