import {useNavigate, useParams, useLocation} from 'react-router-dom';
import {createContext, useEffect, useState, useRef} from 'react';
import jwt_decode from "jwt-decode";
import CSRFToken from './CSRFToken.tsx';


//Context is designed to share data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    useEffect(() => {
        const adress = window.location.href;
        if(adress == 'http://localhost:3000/login' || adress == 'http://localhost:3000/login/'){
            setAlertStyle("hidden");
        }
    }, [])

    const navigate = useNavigate();
    const location = useLocation();

    const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("authToken")) : null);
    const [username, setUsername] = useState(() => localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken')) : null);
    let [loading, setLoading] = useState(true);

    const [alertText, setAlertText] = useState(null);
    const [alertStyle, setAlertStyle] = useState("hidden");
    const [email, setEmail] = useState("");


    function navigateBack(){
        navigate("/login/", {state: {link: 'http://127.0.0.1:8000/api/login/', type: 'text', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }

    function navigateToPasswordInput(){
        navigate("/login2/", {state: {link: 'http://127.0.0.1:8000/api/login2/', type: 'password', inputValue: 'Zaloguj się', style: 'hidden', style2: 'active', content: 'Hasło'}});
    }

    function navigateToHome(){
        navigate("/");
    }


    async function usernameFilter(e){

        e.preventDefault();

                let response = await fetch("http://127.0.0.1:8000/api/login/", {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type':'application/json',
                        //sprawdz czy nie brakuje
                    },
                    body: JSON.stringify({'username': e.target.usernameorpassword.value})
                })

                let jsonResponse = await response.json();

                console.log(jsonResponse);
                setUsername(jsonResponse.username)

                if(jsonResponse.authenticated == 'false'){
                    navigateBack();
                    setAlertStyle("active");
                    setAlertText("Użytkownik nie istnieje");
                }


                else if(jsonResponse.authenticated == 'true'){
                    navigateToPasswordInput();
                    setAlertStyle("hidden");
                }

             e.target.usernameorpassword.value = "";

        }


    async function loginUser(e){

        e.preventDefault();

            let response = await fetch("http://127.0.0.1:8000/api/token/", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({'username': username, 'password': e.target.usernameorpassword.value})
            })

            let data = await response.json()

            console.log(data)

            if(response.status === 200){
                setAuthToken(data)
                setUsername(jwt_decode(data.access))

                localStorage.setItem("authToken", JSON.stringify(data))
                localStorage.setItem("username", username)

                console.log(jwt_decode(localStorage.getItem("authToken")));
                navigateToHome()
            }

            else{
                navigateToPasswordInput()
                setAlertStyle("active");
                setAlertText("Niepoprawne hasło");
            }

            e.target.usernameorpassword.value = "";
    }


    function logout(){
        setAuthToken(null);
        setUsername(null);
        localStorage.removeItem("authToken");

        navigateToHome()
        console.log("bidon");
    }


    let updateToken = async () => {

        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authToken.refresh})
        })

        let data = await response.json()
        console.log(data)

        if (response.status === 200){
            setAuthToken(data)
            setUsername(jwt_decode(data.access))
            localStorage.setItem('authToken', JSON.stringify(data))
        }

        else{
            logout();
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