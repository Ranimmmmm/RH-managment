import { Navigate } from 'react-router-dom';

// ProtectedRoute simply decides what to render based on the authentication status
export function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
