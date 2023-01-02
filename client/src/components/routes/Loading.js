import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingGIF from "../../images/loading.gif";

export default function Loading({ path = "login" }) {
    // state
    const [count, setCount] = useState(3);
    // hooks
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount);  //currenCount is a name only
        }, 1000);
        //redirect once count = 0
        count === 0 && navigate(`/${path}`, {
            state: location.pathname
        });
        // cleanup
        return () => clearInterval(interval); 
    },[count]);

    return <div className="d-flex justify-content-center align-items-center vh-100">
        <img src={LoadingGIF} alt="Loading" style={{ width: "50px" }} />
    </div>;
}