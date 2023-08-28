import {useNavigate} from 'react-router-dom';
import React, {createContext, useEffect, useState, ChangeEvent} from 'react';
import jwt_decode from "jwt-decode";
import {parsedCookies} from './static_ts_files/parsingCookie'

interface ContextProvider {
    children: React.ReactNode;
}


const initialValues = {
    loginUser: () => {},
    usernameFilter: () => {},
    logout: () => {},
    alertStyle: "",
    alertText: "",
    username: null,
    authToken: null,
    currency: null
}


interface AuthToken {
    access: string;
    refresh: string;
}


interface UserData {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    user_id: number;
    username: string;
    email: string;
    currency: string;
}


interface InitialValuesTypes {
    loginUser: (e: ChangeEvent<HTMLFormElement>) => void;
    usernameFilter: (e: ChangeEvent<HTMLFormElement>) => void;
    logout: () => void;
    alertStyle: string;
    alertText: string;
    username: null | UserData;
    authToken: null | AuthToken;
}


const AuthContext = createContext<InitialValuesTypes>(initialValues);

export default AuthContext;

export const AuthProvider = ({children}: ContextProvider) => {
    const navigate = useNavigate();

    window.addEventListener('popstate', function(e: PopStateEvent) {
        setAlertStyle("hidden")
        navigate("/");
    });

    const [authToken, setAuthToken] = useState<AuthToken | null>(parsedCookies.authToken ? parsedCookies.authToken : null);
    const [username, setUsername] = useState<UserData | null>(parsedCookies.username ? jwt_decode(parsedCookies.username) : null);

    const [alertStyle, setAlertStyle] = useState<string>("hidden");
    const [alertText, setAlertText] = useState<string>("");

    const navigateBack = (): void => {
        navigate("/login/", {state: {type: 'text', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'Nazwa użytkownika'}});
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
            const response = await fetch(`http://127.0.0.1:8000/api/login/${e.target.usernameorpassword.value}`, {
                method: 'GET', 
                credentials: 'include',
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
            const response = await fetch("http://127.0.0.1:8000/api/token/", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({'username': username, 'password': e.target.usernameorpassword.value})
            })

            const data = await response.json()

            if(response.status === 200){
                const decodedCurrency: UserData = jwt_decode(data.access)
                console.log(decodedCurrency)

                document.cookie = `username=${JSON.stringify(data.access)}`
                document.cookie = `currency=${decodedCurrency["currency"]}`;
                document.cookie = `authToken=${JSON.stringify(data)}`;
            
                setAuthToken(data)
                setUsername(data.access)

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


    function logout(){
        setAuthToken(null);
        setUsername(null);

        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "currency=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

        navigateToHome()
        window.location.reload();
    }

    const updateToken = async () => {

        try{
            const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({'refresh':authToken?.refresh})
            })

            const data = await response.json()

            if (response.status === 200){
                setAuthToken(data)
                setUsername(jwt_decode(data.access))
            }

            else logout();
        }

        catch(error){alert('An error occurred. Please try again later.');}
    }

    const fourMinutes = 1000 * 60 * 4;
    useEffect(() => {
        let interval = setInterval(() => {
            if(authToken){
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [authToken])


    const contextData = {
        loginUser: loginUser,
        usernameFilter: usernameFilter,
        alertStyle: alertStyle,
        alertText: alertText,
        username: username,
        authToken: authToken,
        logout: logout,
    }


    return(
        <AuthContext.Provider value = {contextData}>
            {children}
        </AuthContext.Provider>
    )

}