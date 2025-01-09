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


//delete
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete) {
    buttonDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có thực sự muốn xóa hay không");
            if (confirmDelete) {
                const idRole = button.getAttribute("id-role");
                const formDelete = document.querySelector("#form-delete");
                const path = formDelete.getAttribute("path");
                formDelete.setAttribute("action", `${path}/${idRole}?_method=DELETE`);
                formDelete.submit();
            }
        })
    })
}

//end delete 
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

//delete multi

const buttonDeleteMulti = document.querySelector("[button-delete-multi]");
if (buttonDeleteMulti) {
    buttonDeleteMulti.addEventListener("click", () => {
        const confirmDeleteMulti = confirm("Bạn có muỗn xóa những gì đã chọn không ?");
        let arrayId = [];
        if (confirmDeleteMulti) {
            const inputCheckbox = document.querySelectorAll("input[name='id']");
            inputCheckbox.forEach((input) => {
                const idRole = input.getAttribute("value");
                if (input.checked) {
                    arrayId.push(idRole);
                }
            })
        }
        const formDelete = document.querySelector("#form-delete");
        if (formDelete) {
            const path = formDelete.getAttribute("path");
            formDelete.setAttribute("action", `${path}/${arrayId.join(',')}?_method=PATCH`);
            formDelete.submit();
        }
    })
}
//end delete multi

//permission
const tablePermission = document.querySelector("[table-permission]");
if (tablePermission) {
    const permissionJson = [];
    const buttonUpdate = document.querySelector("[button-update]");
    const rolePermission = document.querySelectorAll("[data-name]");
    if (buttonUpdate) {
        buttonUpdate.addEventListener("click", () => {
            if (rolePermission) {
                rolePermission.forEach((tmp) => {
                    const dataName = tmp.getAttribute("data-name");
                    const inputPermissions = tmp.querySelectorAll("th");
                    if (dataName === "id") {
                        inputPermissions.forEach(input => {
                            const json = { permission: [] };

                            json.id = input.getAttribute("id-role");
                            permissionJson.push(json);
                        })
                    }
                    else {
                        inputPermissions.forEach((input, index) => {
                            const checkboxInput = input.querySelector("input");
                            if (checkboxInput.checked) {
                                permissionJson[index].permission.push(dataName);
                            }
                        })
                    }
                })
            }
            const permissionString = JSON.stringify(permissionJson);
            const formPermission = document.querySelector("[form-permission]");
            const inputFrom = document.querySelector("[input-permission]");
            if(inputFrom)
            {
                inputFrom.setAttribute("value" , permissionString);
                formPermission.submit();
            }
        })
    }

}



const dataRoles = document.querySelector("[data-role]");
if(dataRoles)
{
    const data = JSON.parse(dataRoles.getAttribute("data"));
    data.forEach((item , index) => {
        const arrayPermission = item.permission;
        arrayPermission.forEach(permission => {
            const dataRole = document.querySelector(`tr[data-name='${permission}']`);
            let changPermissiong = dataRole.querySelectorAll("input");
            changPermissiong[index].checked = true;
        })

    })
}
//end permission
