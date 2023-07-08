

interface PriceLimits {
    item: {
        desc: string,
        range: {start : number, end : number}
    }
}




let priceLimits = [
    {item: {desc: "Do 20zł", range: {start: 1, end: 20}}},
    {item: {desc: "20 do 50zł", range: {start: 20.01, end: 50}}},
    {item: {desc: "50 do 100zł", range: {start: 50.01, end: 100}}},
    {item: {desc: "100 do 150zł", range: {start: 100.01, end: 150}}},
    {item: {desc: "150zł i więcej", range: {start: 150.01, end: 99999}}},
]



export {priceLimits}