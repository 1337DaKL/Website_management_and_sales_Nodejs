// alert
const alertHidden = document.querySelector("[show-alert]");
if (alertHidden) {
    const dataTime = parseInt(alertHidden.getAttribute("data-time"));
    setTimeout(() => {
        alertHidden.classList.add("alert-hidden");
    }, dataTime);
    const buttonCloseAlert = alertHidden.querySelector("[button-close-alert]");
    if (buttonCloseAlert) {
        buttonCloseAlert.addEventListener("click", () => {
            alertHidden.classList.add("alert-hidden");
            console.log("ok")
        })
    }
}

//clear search
const buttonClearSearch = document.querySelector("#button-clear");
if (buttonClearSearch) {
    buttonClearSearch.addEventListener("click", () => {
        const url = new URL(window.location.href);
        url.searchParams.delete("keyword");
        window.location.href = url;
    })
}
//end clear seach