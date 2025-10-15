import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { ReactElement } from 'react';

interface ProtectedRoutesProps {
    redirectPath?: string;
    component: ReactElement;
}


const ProtectedRoutes = ({ redirectPath = '/login', component }: ProtectedRoutesProps) => {

    const { isAuthorized } = useAuth()

    console.log((isAuthorized));
    

    if (!isAuthorized) {
        const params = new URLSearchParams(location.search);
        const userId = params.get("userId");

        if (userId) {
            return <Navigate to={`/login?userId=${userId}`} replace />;
        }

        return <Navigate to={redirectPath} replace />;
    }
    
    console.log('Component');
    
    return component;
};

export default ProtectedRoutes;