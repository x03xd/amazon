import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from './AuthenticationContext';

interface ProtectedRouteProps {
  path: string;
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({element}) => {
    const { authToken } = useContext(AuthContext);

      const location = useLocation();
      const isAuthRoute = ['/login', '/login/', '/registration', '/registration/', '/login2', '/login2/'].some(route => location.pathname.includes(route));
   

      if (!authToken && !isAuthRoute) {
            const stateData = {
              link: 'http://127.0.0.1:8000/login/',
              inputValue: 'Dalej',
              style: 'active',
              style2: 'hidden',
              content: 'E-mail lub numer telefonu komórkowego'
            };
    
          return <Navigate to="/login" state={stateData} />;
      }

      if (authToken && isAuthRoute){
          return <Navigate to = "/" />;
      }


    return <>{element}</>;
};

export default ProtectedRoute;
