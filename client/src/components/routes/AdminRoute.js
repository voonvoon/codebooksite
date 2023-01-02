import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"; //return tis = return component
import { useAuth } from "../../context/auth";
import Loading from "./Loading";
import axios from 'axios';

export default function AdminRoute () {
    //context
    const [auth, setAuth] = useAuth();
    // state
    const [ok, setOk] = useState(false);

    useEffect(() => {
        const adminCheck = async () => {
            const { data } = await axios.get(`/admin-check`);
            if (data.ok) {
                setOk(true);
            } else {
                setOk(false);
            }
        };

        adminCheck();
    }, [auth?.token]);


    return ok ? <Outlet /> : <Loading path =""/>;
};