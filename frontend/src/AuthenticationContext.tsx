import {useNavigate} from 'react-router-dom';
import React, {createContext, useState, ChangeEvent, useEffect} from 'react';
import {parsedCookies} from './static_ts_files/parsingCookie'
import { UserInterface } from './static_ts_files/commonInterfaces';
import {backendURL} from './static_ts_files/constants'

interface ContextProvider {
    children: React.ReactNode;
}

const initialValues = {
    loginUser: () => {},
    usernameFilter: () => {},
    logout: () => {},
    fetchUserData: () => {},
    alertStyle: "",
    alertText: "",
    username: null,
    authToken: null,
}

interface AuthToken {
    access: string;
    refresh: string;
}

interface InitialValuesTypes {
    loginUser: (e: any) => void;
    usernameFilter: (e: any) => void;
    logout: () => void;
    fetchUserData: () => void;
    alertStyle: string;
    alertText: string;
    username: string | null;
    authToken: null | AuthToken;
}

const AuthContext = createContext<InitialValuesTypes>(initialValues);

export default AuthContext;

export const AuthProvider = ({children}: ContextProvider) => {
    const navigate = useNavigate();

    const [authToken, setAuthToken] = useState<AuthToken | null>(parsedCookies.access_token ? parsedCookies.access_token : null);
    const [refreshToken, setRefreshToken] = useState<AuthToken | null>(parsedCookies.refresh_token ? parsedCookies.refresh_token : null);
    const [alertText, setAlertText] = useState<string>("");
    const [alertStyle, setAlertStyle] = useState<string>("hidden");
    const [username, setUsername] = useState<string | null>(null);

    const navigateBack = (): void => {
        navigate("/login/", {state: {type: 'text', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }

    const navigateToPasswordInput = (): void => {
        navigate("/login2/", {state: {type: 'password', inputValue: 'Zaloguj się', style: 'hidden', style2: 'active', content: 'Hasło'}});
    }

    const navigateToHome = (): void => {
        navigate("/");
    }

    async function usernameFilter(e: ChangeEvent<HTMLFormElement>){
        e.preventDefault();
    
        try{
            const response = await fetch(`${backendURL}/login/${e.target.usernameorpassword.value}`, {
                method: 'GET', 
                headers: {
                    'Content-Type':'application/json',
                },
            })
            const jsonResponse = await response.json();
            setUsername(jsonResponse?.username)
    
            if(jsonResponse?.authenticated){
                navigateToPasswordInput();
                setAlertStyle("hidden");
            }
    
            else {
                navigateBack();
                setAlertStyle("active");
                setAlertText("Użytkownik nie istnieje");
            }
    
            e.target.usernameorpassword.value = "";
        }
    
        catch(error){
            alert('An error occurred. Please try again later.');
        }

    }

    async function loginUser(e: ChangeEvent<HTMLFormElement>){
        e.preventDefault();

        try {
            const response = await fetch(`${backendURL}/token/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({'username': username, 'password': e.target.usernameorpassword.value})
            })
            const data = await response.json()

            if(response.status === 200){
                document.cookie = `access_token=${data.access};`
                document.cookie = `refresh_token=${data.refresh};`

                setCurrencyCookieFromJWT(data.access)
                setAuthToken(data.access)
                setRefreshToken(data.refresh)
                navigateToHome()
            }

            else{
                navigateToPasswordInput()
                setAlertStyle("active");
                setAlertText("Niepoprawne hasło");
            }

            e.target.usernameorpassword.value = "";
        }
        
        catch(error){alert('An error occurred. Please try again later.');}
    }


    const setCurrencyCookieFromJWT = (jwt: string): void => {
        const [header, payload, signature] = jwt.split('.');
      
        try {
            const decodedPayload = JSON.parse(atob(payload));
            const currency = decodedPayload?.currency;
    
            if (currency) {
                document.cookie = `currency=${currency}; SameSite=None;`;
                console.log(`Currency set to: ${currency}`);
            } else {
                console.warn("Currency not found in JWT payload.");
            }
        }
        
        catch (error) {
            console.error("Error decoding JWT payload:", error);
        }
    }


    async function fetchUserData(): Promise<UserInterface | null>  {
        try {
            const fetchOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            };
            const response = await fetch(`${backendURL}/get-user/`, fetchOptions);
            const result = await response.json();

            if (result.status) {
                return result.data
            }
            return null;
        }
        
        catch (error) {
            return null;
        }
    };


    function logout(){
        setAuthToken(null);
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "currency=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

        navigateToHome()
        window.location.reload();
    }

    const updateToken = async () => {

        try{
            const response = await fetch(`${backendURL}/token/refresh/`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({'refresh':refreshToken})
            })

            const data = await response.json()

            if (response.status === 200){
                setAuthToken(data.access)
                setRefreshToken(data.refresh)
            }

            else logout();
        }

        catch(error){alert('An error occurred. Please try again later.');}
    }
    
    const fourMinutes = 1000 * 10;
    useEffect(() => {

        let interval = setInterval(() => {
            if(authToken){
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [authToken])


    let contextData = {
        loginUser: loginUser,
        usernameFilter: usernameFilter,
        alertStyle: alertStyle,
        alertText: alertText,
        username: username,
        authToken: authToken,
        logout: logout,
        fetchUserData,
    }


    return(
        <AuthContext.Provider value = {contextData}>
            {children}
        </AuthContext.Provider>
    )

}

