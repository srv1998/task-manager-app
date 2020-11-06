const addInterest=(p,r,t)=>{
    const i=(p*r*t)/100
    return p+i
}
const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

module.exports={
    addInterest,
    fahrenheitToCelsius,
    celsiusToFahrenheit
}