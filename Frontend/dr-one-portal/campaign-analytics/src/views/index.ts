import { lazy } from 'react';

// import views
const AggregateView = lazy(() => import('./aggregate/Aggregate.view'));
const SpecificView = lazy(() => import('./specific/Specific.view'));
const PerformanceReport = lazy(() => import('./PerformanceReport'));

// export named views
export { AggregateView, SpecificView, PerformanceReport };
