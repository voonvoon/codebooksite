import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"; //return tis = return component
import { useAuth } from "../../context/auth";
import Loading from "./Loading";
import axios from 'axios';

export default function PrivateRoute () {
    //context
    const [auth, setAuth] = useAuth();
    // state
    const [ok, setOk] = useState(false);

    useEffect(() => {
        const authCheck = async () => {
            const { data } = await axios.get(`/auth-check`);
            if (data.ok) {
                setOk(true);
            } else {
                setOk(false);
            }
        };

        authCheck();
    }, [auth?.token]);

    // useEffect(() => {
    //     if (auth?.token) {
    //         setOk(true);
    //     } else {
    //         setOk(false);
    //     }
    // },[auth?.token]);

    return ok ? <Outlet /> : <Loading />;
};