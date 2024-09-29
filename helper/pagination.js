module.exports =  (query , countOjects) => {
    let ojectPagination = {
        currentPage : 1,
        limitPage: 4
    }
    if(query.page)
    {
        ojectPagination.currentPage = parseInt(query.page);
    }
    ojectPagination.skipPage = (ojectPagination.currentPage - 1) * ojectPagination.limitPage;
    ojectPagination.countOjects = countOjects;
    ojectPagination.totalPages = Math.ceil(ojectPagination.countOjects / ojectPagination.limitPage);
    return ojectPagination;
}