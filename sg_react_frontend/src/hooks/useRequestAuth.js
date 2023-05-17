import { useCallback, useState, useContext } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

import { AuthContext } from "../contexts/AuthContextProvider";
import formatHttpApiError from "../helpers/formatHttpApiError";
import getCommonOptions from "../helpers/axios/getCommonOptions";

export default function useRequestAuth() {
    const [loading, setLoading] = useState(false);
    const [logoutPending, setLogoutPending] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState(null);
    const { setIsAuthenticated, setUser } = useContext(AuthContext);

    const handleRequestError = useCallback((err) => {
        const formattedError = formatHttpApiError(err);
        setError(formattedError);
        enqueueSnackbar(formattedError);
        setLoading(false);
    }, [enqueueSnackbar, setLoading, setError])

    const register = useCallback(({ username, email, password }, successCallback) => {
        setLoading(true);
        axios.post("/api/auth/users/", {
            username,
            email,
            password
        }).then(() => {
                enqueueSnackbar("Sign up is successful, you can now sign in with your credentials");
                setLoading(false);
                if (successCallback) {
                    successCallback();
                }
            }).catch(handleRequestError)
    }, [enqueueSnackbar, handleRequestError, setLoading])

    const fetchUserId = () => {  // Store user ID in local storage
        axios.get("/api/auth/users/me/", {
            headers: {
                Authorization: `Token ${localStorage.getItem("authToken")}`
              }
        })
          .then(res => localStorage.setItem('userId', res.data.id))
          .catch(handleRequestError);
    };

    const login = useCallback(({ username, password }) => {
        setLoading(true);
        axios.post("/api/auth/token/login/", {
            username,
            password
        }).then((res) => {
            const { auth_token } = res.data;
            localStorage.setItem("authToken", auth_token);
            localStorage.setItem('isLoggedIn', 'true'); // Store login status in local storage
            fetchUserId();
            setLoading(false);
            setIsAuthenticated(true);
        }).catch(handleRequestError)
        
    }, [handleRequestError, setLoading, setIsAuthenticated])

    const logout = useCallback(() => {
        setLogoutPending(true);
        axios.post("/api/auth/token/logout/", null, getCommonOptions())
            .then(() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem('userId'); // Remove user ID in local storage
                localStorage.removeItem('isLoggedIn'); // Remove login status in local storage
                setLogoutPending(false);
                setUser(null);
                setIsAuthenticated(false);
            }).catch((err) => {
                setLogoutPending(false);
                handleRequestError(err);
            })
    }, [handleRequestError, setLogoutPending, setIsAuthenticated, setUser])

    return {
        register,
        login,
        logout,
        logoutPending,
        loading,
        error
    }

}