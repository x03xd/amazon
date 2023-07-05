import {useNavigate} from 'react-router-dom';
import React, {createContext, useEffect, useState, ChangeEvent} from 'react';
import jwt_decode from "jwt-decode";
import {parsedCookies} from './static_ts_files/parsingCookie'


interface ContextProvider {
    children: React.ReactNode;
}

//Context is designed to share data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language

    
const initialValues = {
    loginUser: () => {},
    usernameFilter: () => {},
    logout: () => {},
    email: null,
    alertStyle: "",
    alertText: "",
    username: null,
    authToken: null
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
}


interface InitialValuesTypes {
    loginUser: (e: any) => void;
    usernameFilter: (e: any) => void;
    logout: () => void;
    email: null | string;
    alertStyle: string;
    alertText: string;
    username: null | UserData;
    authToken: null | AuthToken;
}


const AuthContext = createContext<InitialValuesTypes>(initialValues);

export default AuthContext;

export const AuthProvider = ({children}: ContextProvider) => {

    const navigate = useNavigate();

    const [authToken, setAuthToken] = useState<AuthToken | null>(parsedCookies.authToken ? parsedCookies.authToken : null);
    const [username, setUsername] = useState<UserData | null>(parsedCookies.username ? jwt_decode(parsedCookies.username) : null);

    const [alertText, setAlertText] = useState<string>("");
    const [alertStyle, setAlertStyle] = useState<string>("hidden");
    const [email, setEmail] = useState<string>("");

    const navigateBack = (): void => {
        navigate("/login/", {state: {link: 'http://127.0.0.1:8000/api/login/', type: 'text', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }

    const navigateToPasswordInput = (): void => {
        navigate("/login2/", {state: {link: 'http://127.0.0.1:8000/api/login2/', type: 'password', inputValue: 'Zaloguj się', style: 'hidden', style2: 'active', content: 'Hasło'}});
    }

    const navigateToHome = (): void => {
        navigate("/");
    }



    async function usernameFilter(e: ChangeEvent<HTMLFormElement>){
        e.preventDefault();

        try{

            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({'username': e.target.usernameorpassword.value})
            })

            const jsonResponse = await response.json();
            setUsername(jsonResponse.username)

            if(jsonResponse.authenticated){
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
            console.log('Error:', error);
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
                
                document.cookie = `username=${JSON.stringify(data.access)}`
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
        
        catch(error){
            console.log('Error:', error);
        }
    }


    function logout(){
        setAuthToken(null);
        setUsername(null);

        document.cookie = "username = null"
        document.cookie = "authToken = null"

        navigateToHome()
        window.location.reload();
    }


    const updateToken = async () => {

        try{
            let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({'refresh':authToken?.refresh})
            })

            let data = await response.json()
                console.log(data)

            if (response.status === 200){
                setAuthToken(data)
                setUsername(jwt_decode(data.access))
            }

            else{
                logout();
            }

        }

        catch (error) {
            console.error('Error updating token:', error);
        }

    }

    const fourMinutes = 1000 * 60 * 4;
    useEffect(()=>{

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
        email: email,
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

