// alert
const alertHidden = document.querySelector("[show-alert]");
if (alertHidden) {
    const dataTime = parseInt(alertHidden.getAttribute("data-time"));
    setTimeout(() => {
        alertHidden.classList.add("alert-hidden");
    }, dataTime);
    const buttonCloseAlert = alertHidden.querySelector("[button-close-alert]");
    if (buttonCloseAlert) {
        buttonCloseAlert.addEventListener("click", () => {
            alertHidden.classList.add("alert-hidden");
        })
    }
}

// end alert
//checked all
const checkAll = document.querySelector("input[name='checkall']");
const checkId = document.querySelectorAll("input[name='id']");
if (checkAll) {
    checkAll.addEventListener("click", () => {
        if (checkId) {
            if (checkAll.checked) {
                checkId.forEach((input) => {
                    input.checked = true;
                })
            }
            else {
                checkId.forEach((input) => {
                    input.checked = false;
                })
            }
        }
    })
}
if (checkId) {
    checkId.forEach((item) => {
        item.addEventListener("click", () => {
            const countCheckedItem = document.querySelectorAll("input[name='id']:checked").length;
            if (countCheckedItem === checkId.length) {
                checkAll.checked = true;
            }
            else {
                checkAll.checked = false;
            }
        })
    })
}
//end checked all

//Search input
const searchInput = document.querySelector("#form-search");
if(searchInput)
{
    searchInput.addEventListener("submit" , (e) => {
        e.preventDefault();
        let url = new URL(window.location.href);
        const keyword = e.target.elements.keyword.value;
        url.searchParams.delete("page");
        if(keyword)
        {
            url.searchParams.set("keyword" , keyword);
        }
        else
        {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    })
}
//End search input

//Button-Clear search
const buttonClearKeywordSearch = document.querySelector("#button-clear");
if(buttonClearKeywordSearch)
{
    buttonClearKeywordSearch.addEventListener("click" , (e) => {
        let url = new URL(window.location.href);
        if(url.searchParams.get("keyword"))
        {
            url.searchParams.delete("keyword");
            window.location.href = url.href;
        }
    })
}
//End Button-clear search

//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination)
{
    buttonsPagination.forEach((button) => {
        button.addEventListener("click" , () => {
            let url = new URL(window.location.href);
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page" , page);
            window.location.href = url.href;
        })
    });
}
//End Pagination










