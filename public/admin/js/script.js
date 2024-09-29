//button status
const buttonsStatus = document.querySelectorAll("[button-status]");
if(buttonsStatus.length > 0)
{
    let url = new URL(window.location.href);
    buttonsStatus.forEach((button) => {
        button.addEventListener("click" , () => {
            url.searchParams.delete("page");
            const status = button.getAttribute("button-status");
            if(status)
            {
                url.searchParams.set("status" , status);
            }
            else
            {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        })
    })
}
//end button status

//Search input
const searchInput = document.querySelector("#form-search");
let url = new URL(window.location.href);
searchInput.addEventListener("submit" , (e) => {
    e.preventDefault();
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
//End search input

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


//Button-Clear
const buttonClear = document.querySelector("#button-clear");
buttonClear.addEventListener("click" , (e) => {
    let url = new URL(window.location.href);
    url.searchParams.delete("keyword");
    window.location.href = url.href;
})
//End Button-clear

//Change button all status
const changeStatusAll = document.querySelector("[change-status-multi]");
const tickAll = changeStatusAll.querySelector("input[name='checkall']");
const inputsTick = changeStatusAll.querySelectorAll("input[name='id']");
tickAll.addEventListener("click" , () => {
    const statusClick = tickAll.checked;
    if(statusClick)
    {
        inputsTick.forEach((input) => {
            input.checked = true;
        })
    }
    else{
        inputsTick.forEach((input) => {
            input.checked = false;
        })
    }
})
inputsTick.forEach((input) => {
    input.addEventListener("click" , () => {
        const countAllTick = inputsTick.length;
        const countAllChecked = changeStatusAll.querySelectorAll("input[name='id']:checked").length;
        if(countAllTick == countAllChecked)
        {
            tickAll.checked = true;
        }
        else
        {
            tickAll.checked = false;
        }
    })
})
//end Change button all status

//form change status multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti)
{
    formChangeMulti.addEventListener("submit" , (e) => {
        e.preventDefault();
        const selectOption = document.querySelector("[select-option]");
        let string  = `Bạn có chắc chắn muốn thực hiện ${selectOption.value == "active" ? "thay đổi trạng thái thành HOẠT ĐỘNG" : selectOption.value == "inactive" ? "thay đổi trạng thái thành KHÔNG HOẠT ĐỘNG" : selectOption.value == "delete" ? "hành động XÓA không?" : "THAY ĐỔI VỊ TRÍ không?"}`;
        const idsSubmit = changeStatusAll.querySelectorAll("input[name='id']:checked");
        if(idsSubmit.length > 0)
        {
            if(selectOption.value != "active" && selectOption.value != "inactive" && selectOption.value != "delete" && selectOption.value != "change-position")
            {
                alert("Bạn chưa chọn hành động nào cả");
            }
            else
            {
                let confirmOk = confirm(string);
                if(confirmOk)
                {
                    let ids = [];
                    idsSubmit.forEach((input) => {
                        if(selectOption.value == "change-position")
                        {
                            const position = input.closest("tr").querySelector("[position-change]").value;
                            const id = input.getAttribute("value");
                            ids.push(`${id}-${position}`);
                        }
                        else
                        {   
                            ids.push(input.getAttribute("value"));
                        }
                    })
                    let url = new URL(window.location.href);
                    const inputSubmit = document.querySelector("[input-submit]");
                    inputSubmit.setAttribute("value" , ids.join(","));
                    formChangeMulti.submit();
                }
            }
        }
        else
        {
            alert("Chua co san pham nao duoc chon!!");
        }
    })
}
//end form change status multi


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
