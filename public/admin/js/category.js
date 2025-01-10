//button filter status
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
//end button fillter status

//change status one product
const buttonsChangeStatus = document.querySelectorAll("[change-status]");
const formChange = document.querySelector("#form-change");
buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
        const statusCurrent = button.getAttribute("status");
        const id = button.getAttribute("id");
        const statusNew = statusCurrent == "inactive" ? "active" : "inactive";
        let path = formChange.getAttribute("path");
        path = path + statusNew + "/" + id + "?_method=PATCH";
        formChange.setAttribute("action", path);
        formChange.submit();
    })
})
//end change status one product

//Delete product
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete) {
    buttonsDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const confimDelete = confirm("Bạn có chắc muốn xóa sản phẩm không??");
            if (confimDelete) {
                const idProductDelete = button.getAttribute("id-product");
                const formDelete = document.querySelector("#form-delete");
                const path = formDelete.getAttribute("path");
                const newAction = `${path}/${idProductDelete}?_method=DELETE`;
                formDelete.setAttribute("action", newAction);
                formDelete.submit();
            }
        })
    })
}
//End delete product

//form change status multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti)
{
    formChangeMulti.addEventListener("submit" , (e) => {
        e.preventDefault();
        const selectOption = document.querySelector("[select-option]");
        let string  = `Bạn có chắc chắn muốn thực hiện ${selectOption.value == "active" ? "thay đổi trạng thái thành HOẠT ĐỘNG" : selectOption.value == "inactive" ? "thay đổi trạng thái thành KHÔNG HOẠT ĐỘNG" : selectOption.value == "delete" ? "hành động XÓA không?" : "THAY ĐỔI VỊ TRÍ không?"}`;
        
        const idsSubmit = document.querySelectorAll("input[name='id']:checked");
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

//sort
const sort = document.querySelector("#sort-select");
if (sort) {
    let url = new URL(window.location.href);
    sort.addEventListener("change", (e) => {
        const [sortKey, sortValue] = e.target.value.split("-");
        if (sortKey && sortValue) {
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);
            window.location.href = url.href;
        }
    })
    const sKey = url.searchParams.get("sortKey");
    const sValue = url.searchParams.get("sortValue");
    const str = `${sKey}-${sValue}`;
    const optionSelect = sort.querySelector(`option[value='${str}']`);
    if(optionSelect)
    {
        optionSelect.selected = true;
    }
}
const clearSort = document.querySelector("#sort-clear");
if (clearSort) {
    clearSort.addEventListener("click", () => {
        let url = new URL(window.location.href);
        if(url.searchParams.get("sortKey"))
        {
            url.searchParams.delete("sortKey");
        }
        if(url.searchParams.get("sortValue"))
        {
            url.searchParams.delete("sortValue");
        }
        window.location.href = url.href;
    })
}
//endsort

