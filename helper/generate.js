module.exports.generateToken = (length) => {
    const charactors = "qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM";
    let token = "";
    for(let i = 0 ; i  < length ; i++)
    {
        const randoomIndex = Math.floor(Math.random() * charactors.length);
        token += charactors.charAt(randoomIndex);
    }
    return token;
}