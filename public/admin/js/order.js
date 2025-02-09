//change status multi
const transcript = {
    pending: "chuyển trạng thái thành CHỜ XÁC NHẬN",
    confirmed: "chuyển trạng thái thành ĐÃ XÁC NHẬN",
    packing: "chuyển trạng thái thành ĐANG ĐÓNG GÓI",
    shipped: "chuyển trạng thái thành ĐÃ GỬI CHO ĐƠN VỊ VẬN CHUYỂN",
    delivered: "chuyển trạng thái thành GIAO HÀNG THÀNH CÔNG",
    completed: "chuyển trạng thái thành ĐƠN HÀNG HOÀN TẤT",
    delete: "XÓA"
}
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectOption = document.querySelector("[select-option]");
        const valueSelectOption = selectOption.value;
        if (valueSelectOption == "--Chọn hành động--") {
            alert("Bạn chưa chọn hành động nào!!");
        }
        else {
            const inputsTicked = document.querySelectorAll("input[name='id']:checked");
            const ids = [];
            inputsTicked.forEach((input) => {
                const id = input.getAttribute("value");
                ids.push(id);
            })
            if (ids.length <= 0) {
                alert("Bạn chưa chọn đơn hàng nào để thực hiện hành động!");
            }
            else {
                const confirmChangeMulti = confirm(`Bạn có muốn thực hiện hành động ${transcript[valueSelectOption]} với các đơn hàng đã chọn hay không`);
                if (confirmChangeMulti) {
                    const inputSubmit = document.querySelector("[input-submit]");
                    inputSubmit.setAttribute("value", ids.join(","));
                    formChangeMulti.submit();
                }
            }
        }
    })
}
//end change status multi
//fillter status
const buttonsFillterStatus = document.querySelectorAll("[button-status]");
if (buttonsFillterStatus.length > 0) {
    buttonsFillterStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const url = new URL(window.location.href);
            const status = button.getAttribute("button-status");
            if (status != "") {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            window.location.href = url;
        })
    })
}
//end fillter status

//delete order
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
    buttonsDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có muốn chuyển đơn hàng vào thùng rác không?");
            if (confirmDelete) {
                const idDeleted = button.getAttribute("id-product");
                const formDelete = document.querySelector("[formDelete]");
                const path = formDelete.getAttribute("path");
                formDelete.setAttribute("action", `${path}/${idDeleted}?_method=PATCH`);
                formDelete.submit();
            }
        })
    })
}
//end delete order
//update Infor user
const buttonUpdateInforUser = document.querySelector("[button-update-infor-user]");
if(buttonUpdateInforUser) {
    buttonUpdateInforUser.addEventListener("click" , () => {
        const confirmUpdateInfor = confirm("Bạn có muốn thay đổi thông tin người nhận không?");
        if(confirmUpdateInfor) {
            const formInforUser = document.querySelector("[form-infor-user]");
            if(formInforUser) {
                formInforUser.submit();
            }
        }
    })
}
//end update infor user