
export interface ProductsInterface {
    brand: string;
    description: string;
    id: number;
    image: string;
    price: number;
    quantity: number;
    category_name: number;
    title: string;
    bought_by_rec: number[];
}

export interface Categories {
    id: number;
    name : string;
}

export interface PriceLimits {
    item: {
        desc: string,
        range: {start : number, end : number}
    }
}

export interface Brands {
    id: number,
    brand_name: string,
    belong_to_category: number
}

export interface UserInterface {
    username: string;
    email: string;
    id: number;
    currency: string;
}