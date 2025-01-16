//restore product
const buttonsRestore = document.querySelectorAll("[restore-account]");
if (buttonsRestore) {
    buttonsRestore.forEach((button) => {
        button.addEventListener("click", () => {
            const confirmRestore = confirm("Bạn có muốn KHÔI PHỤC lại tài khoản không?");
            if (confirmRestore) {
                const id = button.getAttribute("id-account");
                const formRestore = document.querySelector("#form-restore");
                const path = formRestore.getAttribute("path");
                const action = `${path}/${id}?_method=PATCH`;
                formRestore.setAttribute("action", action);
                formRestore.submit();
            }
        })
    })
}
//end restore product

//delete product
const buttonsDelete = document.querySelectorAll("[delete-account]");
if (buttonsDelete) {
    buttonsDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có thực sự muốn XÓA VĨNH VIỄN tài khoản này không?");
            if (confirmDelete) {
                const id = button.getAttribute("id-account");
                const formDelete = document.querySelector("#form-delete");
                const path = formDelete.getAttribute("path");
                const action = `${path}/${id}?_method=DELETE`;
                formDelete.setAttribute("action", action);
                formDelete.submit();
            }
        })
    })
}
//end delete products

//option 
const formOption = document.querySelector("[form-option]");
formOption.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectOption = document.querySelector("[select-option]");
    let string = `Bạn có muốn ${selectOption.value == "restore" ? "KHÔI PHỤC" : "XÓA VĨNH VIỄN"} tài khoản không?`;
    const checkedId = document.querySelectorAll("input[name='id']:checked");
    if (checkedId.length > 0) {
        if (selectOption.value != "delete" && selectOption.value != "restore") {
            alert("Bạn chưa chọn hành động nào cả!!");
        }
        else {
            const confrimOk = confirm(string);
            if (confrimOk) {
                let ids = [];
                checkedId.forEach((check) => {
                    ids.push(check.getAttribute("id"));
                })
                const formSubmit = document.querySelector("[input-submit]");
                if (formSubmit) {
                    formSubmit.setAttribute("value", ids.join(","));
                }
                formOption.submit();
            }
        }
    }
    else {
        alert("Chưa tài khoản nào được chọn!!")
    }
})
//end option