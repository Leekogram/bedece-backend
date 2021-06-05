const Rates = require('./fxRatesModel')

 const InitializeCurrencies = async () => {
    let data =[
        {currency:"NGN"},
        {currency:"JPY"},
        {currency:"GBP"},
        {currency:"USD"},
        {currency:"EUR"},
        {currency:"CHF"},
        {currency:"CAD"},
        {currency:"NGN"},
        
    ]
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const currency = new Rates(element)
        currency.save((err, doc) => {
            console.log(doc)
        })
    }
   
}

 const currencyCheck = async () => {
     var curr = await Rates.find({}).sort({_id:-1}).limit(1);
     if(curr.length == 0){
         console.log("initilizing currencies")
         let intializer = await  InitializeCurrencies()
         console.log("initilized currencies")
     }  else {
        console.log("currencies available")
     }

}

module.exports = currencyCheck()
