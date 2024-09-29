module.exports = (s) => {

    let string = s.toString();

    let tmp = string.split('').reverse().join('');

    tmp = tmp.replace(/(\d{3})/g, '$1.');

    let stringKetQua = tmp.split('').reverse().join('').replace(/^\./, '');

    return stringKetQua;
}