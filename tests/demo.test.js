const {addInterest,celsiusToFahrenheit,fahrenheitToCelsius}= require('../demo')

test("return amount with interest",()=>{
   const a= addInterest(100,10,2)
//    if(a!==110)
//     throw new Error('function should return 110 but it returned '+a)
   expect(a).toBe(110)
})

test("should convert 32F to 0C",()=>{
    const temp= fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

test("should convert 0C to 32F",()=>{
    const temp=celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})