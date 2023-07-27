import {useNavigate} from 'react-router-dom';
import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import logo from './images/xd.png';
import cart from './images/shopping-cart-xxl.png';

export interface setValueState{
    value: string;
}


export interface NavbarProps {
    overlayStyle: (style: string) => void;
    loginModalStyle: (style: string) => void;
    leftModalStyle: (style: string) => void;
    unclickableNavbarChild: (style: string) => void;
    unclick?: string;
    x: string;
}


interface Categories {
    id: number;
    name : string;
}



const Navbar: React.FC<NavbarProps> = ({ unclick, overlayStyle, loginModalStyle, leftModalStyle, unclickableNavbarChild, x }) => {

    const navigate = useNavigate();

    const [value, setValue] = useState<string>("");
    const [dropdownOptions, setDropdownOptions] = useState<Categories[] | []>([])
    const [dropdownOptionsStyle, setDropdownOptionsStyle] = useState<string>("")

    
    useEffect(() => {  
        try {
            fetch(`http://127.0.0.1:8000/api/categories/`)
            .then(response => response.json())
            .then(result => (setDropdownOptions(result)));

        }
        catch (error){console.error("Error fetching data:", error);}
    }, [])
    

    useEffect(() => {
        if(x === "") setDropdownOptionsStyle("")
    }, [x])


    const searchBarHandling = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const activeDrop = (style: string) => {
        setDropdownOptionsStyle(style)
    }

    const activeOverlay = (style: string) => {
        overlayStyle(style);
    }

    const activeLoginModal = (style: string) => {
        loginModalStyle(style);
    }

    const activeLeftModal = (style: string) => {
        leftModalStyle(style);
    }

    const unclickableNavbar = (style: string) => {
        unclickableNavbarChild(style)
    }

    const subCategoryNavigate = (e: FormEvent<HTMLFormElement>): void => {
        if(value == null) navigate("") ;
        else navigate("s");
    }


    const navigateTo = (location: string): void => {
        navigate(location)
    }

    const dropdownQuery = (categoryName: string) => {
        navigate("s")

        const currentURL = new URL(window.location.href);
        const queryParams = new URLSearchParams(currentURL.search);

        queryParams.set("q", categoryName);
        currentURL.search = queryParams.toString();
        window.history.replaceState(null, "", currentURL.href);
        window.location.reload()
    }

    return(
            <nav>
                <div className = 'navbar-upper-part'>

                    <div onClick = {() => {navigateTo("")}} className = "logo-box cursor-finger">
                        <img className = 'logo mt-2 ms-4' loading = "lazy" src = {logo} alt = "logo" />
                    </div>

                    <div>
                        <span>Witamy</span><br/>
                        <span>Wybierz adres dostawy</span>
                    </div>

                    <div className = "search-bar">
                        <form method = "GET" onSubmit = {subCategoryNavigate}>
                            <input autoComplete="off" onChange = {searchBarHandling} name = "q" className = "main-search-bar" type = "search" onClick = {() => {activeDrop('active'); activeOverlay('active'); unclickableNavbar('pointer-event-handler')}} required/>
                        </form>

                        <ul className={`dropdown-options ${dropdownOptionsStyle}`}>
                            {dropdownOptions.map((option, index: number) => (
                                <li onClick = {() => {dropdownQuery(option?.name)}} key={index}>{option?.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className = "position-static cursor-finger">
                        <span>Witamy, zaloguj sie</span><br/>
                        <span onClick = {() => {activeOverlay('active'); activeLoginModal('active'); unclickableNavbar('pointer-event-handler')}}>Konto i listy</span>
                    </div>

                    <div>
                        <span>Zwroty</span><br/>
                        <span>i zamówienia</span>
                    </div>

                    <div className = "cart-box cursor-finger">
                        <img onClick = {() => {navigateTo("cart")}} className = "cart" src = {cart} loading = "lazy" alt = "cart" />
                        <span>Koszyk</span>
                    </div>

                </div>


                <div className = 'navbar-lower-part'>
                    <div>
                        <span className = "ms-5" onClick= {() => {activeOverlay('active'); activeLeftModal('active'); unclickableNavbar('pointer-event-handler')}}>Menu</span>
                    </div>

                    <div>
                        <span>Prime</span>
                    </div>

                    <div>
                        <span>Okazje</span>
                    </div>

                    <div>
                        <span>Bestsellery</span>
                    </div>

                    <div>
                        <span>Karty Podarunkowe</span>
                    </div>

                    <div>
                        <span>Sprzedawaj na Amazon</span>
                    </div>

                    <div>
                        <span>Dział Obsługi Klienta</span>
                    </div>

                </div>
            </nav>

    );
}

export default Navbar;