// change status account 
const buttonsChangeStatus = document.querySelectorAll("[change-status]");
if (buttonsChangeStatus.length > 0) {
    buttonsChangeStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const idAccount = button.getAttribute("id");
            const statusAccount = button.getAttribute("status");
            const inforChange = `${idAccount},${(statusAccount == "active" ? "inactive" : "active")}`;
            const formChangeStatus = document.querySelector("#form-change");
            if (formChangeStatus) {
                const path = formChangeStatus.getAttribute("path");
                formChangeStatus.setAttribute("action", `${path}/${inforChange}?_method=PATCH`)
                formChangeStatus.submit();
            }
        })
    })
}
//end change status account


//delete account
const buttonDeleteAccount = document.querySelectorAll("[button-delete]");
if (buttonDeleteAccount) {
    buttonDeleteAccount.forEach((button) => {
        button.addEventListener("click", () => {
            const confirmDeleteAccount = confirm("Bạn có thực sự muốn cho tài khoản vào thùng rác hay không ??");
            if (confirmDeleteAccount) {
                const idAccount = button.getAttribute("id");
                const formDeleteAccount = document.querySelector("#form-delete");
                if (formDeleteAccount) {
                    const path = formDeleteAccount.getAttribute("path");
                    formDeleteAccount.setAttribute("action", `${path}/${idAccount}?_method=DELETE`);
                    formDeleteAccount.submit();
                }
            }

        })
    })
}
//end delete account

//change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputsCheckbox = document.querySelectorAll("input[name='id']:checked");
        let ids = [];
        if (inputsCheckbox.length > 0) {

            const selectOption = document.querySelector("[select-option]");
            if (selectOption.value != "active" && selectOption.value != "inactive" && selectOption.value != "delete") {
                alert("Bạn chưa chọn hành động nào cả");
            }
            else {
                const confirmChangeMulti = confirm("Bạn có thực sự muốn thực hiện hành động hay không");
                if (confirmChangeMulti) {
                    inputsCheckbox.forEach((input) => {
                        ids.push(input.getAttribute("value"));
                    })
                    const inputIds = document.querySelector("[input-ids]");
                    if (inputIds) {
                        inputIds.setAttribute("value", ids.join(","));
                    }
                    formChangeMulti.submit();
                }
            }
        }
        else {
            alert("Bạn chưa chọn tài khoản nào!!!");
        }
    })
}
//end change multi

//button filter status
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonsStatus.forEach((button) => {
        button.addEventListener("click", () => {
            url.searchParams.delete("page");
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        })
    })
}
//end button fillter status