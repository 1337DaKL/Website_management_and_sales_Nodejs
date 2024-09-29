//restore product
const buttonsRestore = document.querySelectorAll("[restore-product]");
if(buttonsRestore)
{
    buttonsRestore.forEach((button) => {
        button.addEventListener("click" , () => {
            const confirmRestore = confirm("Bạn có muốn KHÔI PHỤC lại sản phẩm không?");
            if(confirmRestore)
            {
                const id = button.getAttribute("id-product");
                const formRestore = document.querySelector("#form-restore");
                const path = formRestore.getAttribute("path");
                const action = `${path}/${id}?_method=PATCH`;
                formRestore.setAttribute("action" , action);
                formRestore.submit();
            }
        })
    })
}
//end restore product

//delete product
const buttonsDelete = document.querySelectorAll("[delete-product]");
if(buttonsDelete)
{
    buttonsDelete.forEach((button) => {
        button.addEventListener("click" , () => {
            const confirmDelete = confirm("Bạn có thực sự muốn XÓA VĨNH VIỄN sản phẩm này không?");
            if(confirmDelete)
            {
                const id = button.getAttribute("id-delete");
                const formDelete = document.querySelector("#form-delete");
                const path = formDelete.getAttribute("path");
                const action = `${path}/${id}?_method=DELETE`;
                formDelete.setAttribute("action" , action);
                formDelete.submit();
            }
        })
    })
}
//end delete products


//search
const searchDustbin = document.querySelector("[search-dustbin]");
const url = new URL(window.location.href);
searchDustbin.addEventListener("submit" , (e) => {
    e.preventDefault();
    url.searchParams.delete("page");
    const keyword = e.target.elements.query.value;
    if(keyword)
    {
        url.searchParams.set("keyword" , keyword);
    }
    else
    {
        url.searchParams.delete("keyword");
    }
    window.location.href = url;
})
//end search

//button clear
const buttonClear  = document.querySelector("#button-clear");
buttonClear.addEventListener("click" , () => {
    url.searchParams.delete("keyword");
    window.location.href = url;
})
// end button claer


//check
const checkAll = document.querySelector("input[name='checkall']");
const checkId = document.querySelectorAll("input[name='id']");
checkAll.addEventListener("click" , () => {
    const check = checkAll.checked == true ? true : false;
    checkId.forEach(item => {
        item.checked = check;
    })
})
checkId.forEach(item => {
    item.addEventListener("click" , () => {
        const count = document.querySelectorAll("input[name='id']:checked").length;
        if(count == checkId.length)
        {
            checkAll.checked = true;
        }
        else
        {
            checkAll.checked = false;
        }
    })
})
//end check

//option 
const formOption = document.querySelector("[form-option]");
formOption.addEventListener("submit" , (e) => {
    e.preventDefault();
    const selectOption = document.querySelector("[select-option]");
    let string = `Bạn có muốn ${selectOption.value == "restore" ? "KHÔI PHỤC" : "XÓA VĨNH VIỄN"} sản phẩm không?`;
    const checkedId = document.querySelectorAll("input[name='id']:checked");
    if(checkedId.length > 0)
    {
        if(selectOption.value != "delete" && selectOption.value != "restore")
        {
            alert("Bạn chưa chọn hành động nào cả!!");
        }
        else
        {
            const confrimOk = confirm(string);
            if(confrimOk)
            {
                let ids = [];
                checkedId.forEach((check) => {
                    ids.push(check.getAttribute("id"));
                })
                const formSubmit = document.querySelector("[input-submit]");
                formSubmit.setAttribute("value" , ids.join(","));
                console.log(formSubmit);
                formOption.submit();
            }
        }
    }
    else
    {
        alert("Chưa sản phẩm nào được chọn!!")
    }
})
//end option

//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
buttonsPagination.forEach((button) => {
    button.addEventListener("click" , () => {
        let url = new URL(window.location.href);
        const page = button.getAttribute("button-pagination");
        url.searchParams.set("page" , page);
        window.location.href = url.href;
    })
});
//End Pagination

// alert
const alertHidden = document.querySelector("[show-alert]");
if(alertHidden)
{
    const dataTime = parseInt(alertHidden.getAttribute("data-time"));
    setTimeout(() => {
        alertHidden.classList.add("alert-hidden");
    } , dataTime);
}
const buttonCloseAlert = alertHidden.querySelector("[button-close-alert]");
if(buttonCloseAlert)
{
    buttonCloseAlert.addEventListener("click" , () => {
        alertHidden.classList.add("alert-hidden");
    })
}
// end alert