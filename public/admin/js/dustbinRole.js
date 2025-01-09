//restore role
const buttonsRestore = document.querySelectorAll("[restore-role]");
if(buttonsRestore)
{
    buttonsRestore.forEach((button) => {
        button.addEventListener("click" , () => {
            const confirmRestore = confirm("Bạn có muốn khôi phục hay không?");
            if(confirmRestore)
            {
                const idRoleRestore = button.getAttribute("id-role");
                const formRestore = document.querySelector("#form-restore");
                if(formRestore)
                {
                    const path = formRestore.getAttribute("path");
                    formRestore.setAttribute("action" , `${path}/${idRoleRestore}?_method=PATCH`);
                    formRestore.submit();
                }
            }
        })
    })
}
//end restore role