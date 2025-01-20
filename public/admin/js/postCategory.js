const buttonsChangeStatus = document.querySelectorAll("[change-status]");
if (buttonsChangeStatus) {
    buttonsChangeStatus.forEach((buttonChangeStatus) => {
        buttonChangeStatus.addEventListener("click", () => {
            const id = buttonChangeStatus.getAttribute("id");
            const statusNow = buttonChangeStatus.getAttribute("status");
            const statusNew = statusNow == "active" ? "inactive" : "active";
            const formChange = document.querySelector("#form-change");
            if (formChange) {
                const path = formChange.getAttribute("path");
                formChange.setAttribute("action", `${path}${id}/${statusNew}?_method=PATCH`);
                formChange.submit();
            }
        })
    })
}


///detete post category
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete) {
    buttonsDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có muốn chuyển danh mục sản phẩm này vào thùng rác không!!");
            if (confirmDelete) {
                const id = button.getAttribute("id");
                const formDelete = document.querySelector("#form-delete");
                if (formDelete) {
                    const path = formDelete.getAttribute("path");
                    formDelete.setAttribute("action", `${path}/${id}?_method=PATCH`);
                    formDelete.submit();
                }
            }
        })
    })
}
//end delete post category

//fillter status
const buttonFillterStatus = document.querySelectorAll("[button-status]");
if (buttonFillterStatus.length > 0) {
    buttonFillterStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            const url = new URL(window.location.href);
            if (status != "") {
                url.searchParams.set("status", status);
                window.location.href = url;
            }
            else {
                url.searchParams.delete("status");
                window.location.href = url;
            }
        })
    })
}
//end fillter status


//change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectOption = formChangeMulti.querySelector("[select-option]");
        if (selectOption.value != "active" && selectOption.value != "inactive" && selectOption.value != "delete" && selectOption.value != "change-position") {
            alert("Bạn chưa chọn hành động nào!! Vui lòng chọn hành động cần thực hiện");
        }
        else {
            const inputTicked = document.querySelectorAll("input[name='id']:checked");
            if (inputTicked.length <= 0) {
                alert("Bạn chưa chọn danh mục bài viết nào cần thay đổi cả !!");
            }
            else {
                const confirmChangeMulti = confirm("Bạn có muốn thực hiện hành động cho tất cả danh mục đã chọn không?");
                if (confirmChangeMulti) {
                    const inputSubmit = document.querySelector("[input-submit]");
                    const ids = [];
                    inputTicked.forEach((input) => {
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
                    inputSubmit.setAttribute("value", ids.join(","));
                    formChangeMulti.submit();
                }

            }
        }
    })
}
//end change multi