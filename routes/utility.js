 
 
 
 //  add a day to endDate
 module.exports = function addDays(date, days) {
     var result = new Date(date);
     result.setDate(result.getDate() + days);
     return result;
 }