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