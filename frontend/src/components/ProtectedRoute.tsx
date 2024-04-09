import { Navigate, Outlet } from "react-router-dom";

type Props = {
    children?: React.ReactNode
    user: any,
    redirect?: string
}

const ProtectedRoute = ({ children, user, redirect = "/auth" }: Props) => {
    if (!user) return <Navigate to={redirect} />;

    return children ? children : <Outlet />;
};

export default ProtectedRoute;