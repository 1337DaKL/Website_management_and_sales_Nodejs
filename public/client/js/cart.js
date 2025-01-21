//delete product in cart
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
    buttonDelete.forEach((button) => {
        const id = button.getAttribute("id");
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng không?");
            if (confirmDelete) {
                const deleteForm = document.querySelector("[delete-form]");
                const path = `cart/delete/${id}?_method=DELETE`;
                deleteForm.setAttribute("action", path);
                deleteForm.submit();
            }
        })
    })
}
//end delete product in cart

//change quantity product in cart
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
    inputsQuantity.forEach((input) => {
        input.addEventListener("change", (e) => {
            const quantityChange = e.target.value;
            const formChange = document.querySelector("[form-change-quantity]");
            const idProductChange = input.getAttribute("item-id");
            const path = `cart/change-quantity/${idProductChange}/${quantityChange}?_method=PATCH`;
            formChange.setAttribute("action", path);
            formChange.submit();
        })
    })
}
//end change quantity product in cart