import {useNavigate} from 'react-router-dom';
import React, {createContext, useState, ChangeEvent} from 'react';
import {parsedCookies} from './static_ts_files/parsingCookie'
import { UserInterface } from './static_ts_files/commonInterfaces';


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

interface User {
    username: string;
    email: string;
    id: number;
    currency: string;
}

const AuthContext = createContext<InitialValuesTypes>(initialValues);

export default AuthContext;

export const AuthProvider = ({children}: ContextProvider) => {
    const navigate = useNavigate();

    const [authToken, setAuthToken] = useState<AuthToken | null>(parsedCookies.access_token ? parsedCookies.access_token : null);
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
                document.cookie = `access_token=${data.access};`
                document.cookie = `refresh_token=${data.refresh};`
                setAuthToken(data.access)
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

    async function fetchUserData(): Promise<UserInterface | null>  {
        try {
            const fetchOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            };
            const response = await fetch(`http://127.0.0.1:8000/api/get-user/`, fetchOptions);
            const result = await response.json();

            if (result.status) {
                return result;
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

    /*
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
                setAuthToken(data.access)
                //SPRAWDZ??????????
            }

            else{
                logout();
            }

        }

        catch (error) {
            console.error('Error updating token:', error);
        }

    }
    */

    /*
    const fourMinutes = 1000 * 60 * 4;
    useEffect(()=>{

        let interval = setInterval(() => {
            if(authToken){
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [authToken])
    */

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

