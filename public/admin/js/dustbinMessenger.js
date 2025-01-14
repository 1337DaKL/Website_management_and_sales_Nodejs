//fillter dustbin
const buttonFillterDustbin = document.querySelectorAll("[fillter-dustbin]");
if (buttonFillterDustbin) {
    buttonFillterDustbin.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("status");
            if (status !== "") {
                const url = `${window.location.origin}/admin/dustbin-mess?status=${status}`;
                window.location.href = url;
            }
            else {
                const url = `${window.location.origin}/admin/dustbin-mess`;
                window.location.href = url;
            }
        })
    })
}
//end fillter dustbin

const buttonDeleteMulti = document.querySelector("[button-delete-multi]");
if (buttonDeleteMulti) {
    buttonDeleteMulti.addEventListener("click", () => {
        const inputsCheckbox = document.querySelectorAll("input[name='id']:checked");
        if (inputsCheckbox.length > 0) {
            const confirmDeleteMessenger = confirm("Bạn có muốn xóa tin nhắn hay không??");
            if (confirmDeleteMessenger) {
                let ids = [];
                inputsCheckbox.forEach((input) => {
                    const id = input.getAttribute("value");
                    ids.push(id);
                })
                const formDeleteMulti = document.querySelector("[form-delete-multi]");
                const inputIds = formDeleteMulti.querySelector("[ids]");
                if (ids.length > 0) {
                    inputIds.setAttribute("value", ids.join(","));
                }
                formDeleteMulti.submit();
            }
        }
        else {
            alert("Bạn chưa chọn tin nhắn nào cả!!");
        }
    })
}
//end

//seen
const trMess = document.querySelectorAll("[tr-mess]");
if (trMess.length > 0) {
    trMess.forEach((item) => {
        item.addEventListener("click", () => {
            const parentItem = item.parentElement;
            const idMess = parentItem.getAttribute("id-mess");
            const url = `${window.location.origin}/admin/chat/detel/${idMess}`;
            window.location.href = url;
        });
    });
}
//end seen


//button delete
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
    buttonsDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có muốn xóa tin nhắn không");
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
//end button delete
