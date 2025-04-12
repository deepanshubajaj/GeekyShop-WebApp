import { useNavigate } from "react-router-dom";

export function withRouter(Component: any) {
    return function WrappedComponent(props: any) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}
