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
    optionSelect.selected = true;
}
const clearSort = document.querySelector("#sort-clear");
if (clearSort) {
    clearSort.addEventListener("click", () => {
        let url = new URL(window.location.href);
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href;
    })
}

//endsort
