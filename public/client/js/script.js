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


//logout
const buttonLogout = document.querySelector("[button-logout]");
if (buttonLogout) {
    buttonLogout.addEventListener("click", () => {
        const confirmLogout = confirm("Bạn có muốn đăng xuất không?");
        if (confirmLogout) {
            window.location.href = "/user/logout";
        }
    })
}
//end logout

const uploadImages = document.querySelector("[upload-image]");
if(uploadImages)
{
    const inputImage = document.querySelector("[input-image]");
    const imgImage = document.querySelector("[img-image]");
    if(inputImage)
    {
        inputImage.addEventListener("change" , (e) => {
            const file = e.target.files[0];
            imgImage.src = URL.createObjectURL(file);
        })
    }
}


const buttonClear = document.querySelector("[clear-upload]");
if(buttonClear)
{
    buttonClear.addEventListener("click" , () => {
        const inputImage = document.querySelector("[input-image]");
        const imgImage = document.querySelector("[img-image]");
        inputImage.value = "";
        imgImage.setAttribute("src" , "");
    })
}