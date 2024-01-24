interface PriceLimits {
    item: {
        desc: string,
        range: {start : number, end : number}
    }
}

const priceLimits: PriceLimits[] = [
    {item: {desc: "Do 20", range: {start: 1, end: 20}}},
    {item: {desc: "20 do 50", range: {start: 20.01, end: 50}}},
    {item: {desc: "50 do 100", range: {start: 50.01, end: 100}}},
    {item: {desc: "100 do 150", range: {start: 100.01, end: 150}}},
    {item: {desc: "150 i więcej", range: {start: 150.01, end: 99999}}},
]

export {priceLimits}