import transactionRoutes from '../../modules/transactions/routesConfig';

const allRoutes = [
    // ... other existing module routes like bankRoutes, paymentRoutes, etc.
    ...transactionRoutes,
];

// This should be inside your Router component
// <Routes>
//   {allRoutes.map((route, index) => (
//     <Route key={index} path={route.path} element={route.element} />
//   ))}
// </Routes>