module.exports = (query) => {
    let ojectsSearch  = {
        keyword : ""
    }
    if(query.keyword)
    {
        ojectsSearch.keyword = query.keyword;
        const regex = new RegExp(ojectsSearch.keyword , "i");
        ojectsSearch.regex = regex;
    }
    return ojectsSearch;
}


