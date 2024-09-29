module.exports = (s) => {
    if (s == null) {
        return ''; // Hoặc xử lý theo yêu cầu của bạn khi `s` là null hoặc undefined
    }

    let string = s.toString();

    let tmp = string.split('').reverse().join('');

    tmp = tmp.replace(/(\d{3})/g, '$1.');

    let stringKetQua = tmp.split('').reverse().join('').replace(/^\./, '');

    return stringKetQua;
}
