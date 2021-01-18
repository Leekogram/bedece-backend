




 const generator = (req, res) => {
    let a = new Date();
    let month = ("0" + (a.getMonth() + 1));
    let day = ("0" + a.getDate()).slice(-2);
    let year = ("0" + a.getFullYear()).slice(-2)

    let hours = a.getHours();
    let minutes = a.getMinutes();
    let sec = a.getSeconds();
    // let myTime = ( + hours + minutes + sec).slice(-4);

    return `${year}${month}${day}${hours}${minutes}${sec}`
    // return (hours + myTime)

}

module.exports = generator