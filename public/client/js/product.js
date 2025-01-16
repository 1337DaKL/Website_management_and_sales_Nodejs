const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination.length > 0) {
    buttonsPagination.forEach((button) => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            let url = new URL(window.location.href);
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    })
}