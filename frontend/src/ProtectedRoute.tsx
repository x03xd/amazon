import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from './AuthenticationContext';

interface ProtectedRouteProps {
  path: string;
  element: React.ReactNode;
  state?: any
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  state,
}) => {
  const { authToken } = useContext(AuthContext);
  const location = useLocation();

  if (!authToken) {

      const stateData = {
        link: 'http://127.0.0.1:8000/login/',
        inputValue: 'Dalej',
        style: 'active',
        style2: 'hidden',
        content: 'E-mail lub numer telefonu komórkowego'
      };
  
      return <Navigate to="/login" state={stateData} />;
    
  }

  return <>{element}</>;
};

export default ProtectedRoute;