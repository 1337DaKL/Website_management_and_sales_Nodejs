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
if(buttonDeleteAccount)
{
    buttonDeleteAccount.forEach((button) => {
        button.addEventListener("click" , () => {
            const confirmDeleteAccount = confirm("Bạn có thực sự muốn cho tài khoản vào thùng rác hay không ??");
            if(confirmDeleteAccount)
            {
                const idAccount = button.getAttribute("id");
                const formDeleteAccount = document.querySelector("#form-delete");
                if(formDeleteAccount)
                {
                    const path = formDeleteAccount.getAttribute("path");
                    formDeleteAccount.setAttribute("action" , `${path}/${idAccount}?_method=DELETE`);
                    formDeleteAccount.submit();
                }
            }
            
        })
    })
}
//end delete account