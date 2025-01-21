//restore post category
const buttonsRestore = document.querySelectorAll("[restore]");
if (buttonsRestore.length > 0) {
    buttonsRestore.forEach((buttonRestore) => {
        buttonRestore.addEventListener("click", () => {
            const confirmRestore = confirm("Bạn có muốn khôi phục danh mục bài viết không?");
            if (confirmRestore) {
                const id = buttonRestore.getAttribute("id");
                const formRestore = document.querySelector("#form-restore");
                if (formRestore) {
                    const path = formRestore.getAttribute("path");
                    formRestore.setAttribute("action", `${path}/${id}?_method=PATCH`);
                    formRestore.submit();
                }
            }
        })
    })
}
//end restore post category

//delete
const buttonsDelete = document.querySelectorAll("[delete]");
if (buttonsDelete.length > 0) {
    buttonsDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có muốn xóa VĨNH VIỄN danh mục bài viết không?");
            if (confirmDelete) {
                const id = button.getAttribute("id");
                const formDelete = document.querySelector("#form-delete");
                if (formDelete) {
                    const path = formDelete.getAttribute("path");
                    formDelete.setAttribute("action", `${path}/${id}?_method=DELETE`);
                    formDelete.submit();
                }
            }
        })
    })
}
//end delete
//option 
const formOption = document.querySelector("[form-option]");
formOption.addEventListener("submit" , (e) => {
    e.preventDefault();
    const selectOption = document.querySelector("[select-option]");
    let string = `Bạn có muốn ${selectOption.value == "restore" ? "KHÔI PHỤC" : "XÓA VĨNH VIỄN"} danh mục bài viết không?`;
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
                if(formSubmit)
                {
                    formSubmit.setAttribute("value" , ids.join(","));
                }
                formOption.submit();
            }
        }
    }
    else
    {
        alert("Chưa danh mục bài viết nào được chọn!!")
    }
})
//end option