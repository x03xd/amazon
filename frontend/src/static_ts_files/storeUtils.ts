import { PriceLimits, Brands } from './commonInterfaces';


export const isOnlyNumber = (str: string): boolean => {
    return /^[0-9]+$/.test(str);
}
  
export const customPrice = (minVal: string = "", maxVal: string = ""): void => {

    if (!isOnlyNumber(minVal)) alert("Only positive integers accepted at min input");
    if (!isOnlyNumber(maxVal)) alert("Only positive integers accepted at max input");

    else if (parseFloat(minVal) > parseFloat(maxVal))
        alert("The value of min input must be lower than the value of max input");

    else {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('u', `${parseFloat(minVal)}-${parseFloat(maxVal)}`);
        const modifiedQueryString = searchParams.toString();
        const baseUrl = window.location.href.split('?')[0];
        const updatedUrl = baseUrl + '?' + modifiedQueryString;
        window.location.href = updatedUrl;
    }
    
}
  
export const changeQ = (qValue: string): void => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('q', qValue.toLowerCase());
    const modifiedQueryString = searchParams.toString();
    const baseUrl = window.location.href.split('?')[0];
    const updatedUrl = baseUrl + '?' + modifiedQueryString;
    window.location.href = updatedUrl;
}

export function clearQueryString(arg: string, brands: Brands[], prices: PriceLimits[]) {
    switch (arg) {
      case "c":
        brands.forEach((item: Brands, index: number) => {
          const storage = JSON.parse(localStorage.getItem("c" + index) || "");
          const checkStorage = storage ? storage.value : "";
  
          if (checkStorage) {
            localStorage.setItem("c" + index, JSON.stringify({ value: false, nut: "c", id: item["brand_name"] || [] }));
          }
        });
        break;
  
      case "u":
        prices.forEach((_, index: number) => {
          const storage = JSON.parse(localStorage.getItem("u" + index) || "");
          const checkStorage = storage ? storage.value : "";
  
          if (checkStorage) {
            localStorage.setItem("u" + index, JSON.stringify({ value: false, nut: "u", id: prices[index] }));
          }
        });
        break;
  
      case "rating":
        const storage = JSON.parse(localStorage.getItem("rating") || "");
        const checkStorage = storage ? storage.value : "";
  
        if (checkStorage) {
          localStorage.setItem("rating", JSON.stringify({ value: false, num: 0 }));
        }
        break;
  
      default:
        break;
    }
    window.location.reload();
}