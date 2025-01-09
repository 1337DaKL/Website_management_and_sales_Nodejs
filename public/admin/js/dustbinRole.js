//restore role
const buttonsRestore = document.querySelectorAll("[restore-role]");
if (buttonsRestore) {
    buttonsRestore.forEach((button) => {
        button.addEventListener("click", () => {
            const confirmRestore = confirm("Bạn có muốn khôi phục hay không?");
            if (confirmRestore) {
                const idRoleRestore = button.getAttribute("id-role");
                const formRestore = document.querySelector("#form-restore");
                if (formRestore) {
                    const path = formRestore.getAttribute("path");
                    formRestore.setAttribute("action", `${path}/${idRoleRestore}?_method=PATCH`);
                    formRestore.submit();
                }
            }
        })
    })
}
//end restore role

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

//end tick all


// delete role
const buttonDeleteRole = document.querySelectorAll("[delete-role]");
if (buttonDeleteRole) {
    buttonDeleteRole.forEach((button) => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có muốn xóa vĩnh viển hay không?");
            if (confirmDelete) {
                const idRoleDelete = button.getAttribute("id-role");
                const formDelete = document.querySelector("#form-delete");
                if (formDelete) {
                    const path = formDelete.getAttribute("path");
                    formDelete.setAttribute("action", `${path}/${idRoleDelete}?_method=DELETE`);
                    formDelete.submit();
                }
            }
        })
    })
}
//end delete role

//option 
const formOption = document.querySelector("[form-option]");
formOption.addEventListener("submit" , (e) => {
    e.preventDefault();
    const selectOption = document.querySelector("[select-option]");
    let string = `Bạn có muốn ${selectOption.value == "restore" ? "KHÔI PHỤC" : "XÓA VĨNH VIỄN"} quyền quản trị không?`;
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
                formOption.submit();
            }
        }
    }
    else
    {
        alert("Chưa sản phẩm nào được chọn!!")
    }
})