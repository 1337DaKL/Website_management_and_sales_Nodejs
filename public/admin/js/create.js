// alert
const alertHidden = document.querySelector("[show-alert]");
if(alertHidden)
{
    const dataTime = parseInt(alertHidden.getAttribute("data-time"));
    setTimeout(() => {
        alertHidden.classList.add("alert-hidden");
    } , dataTime);
    const buttonCloseAlert = alertHidden.querySelector("[button-close-alert]");
    if(buttonCloseAlert)
    {
        buttonCloseAlert.addEventListener("click" , () => {
        alertHidden.classList.add("alert-hidden");
    })
}
}

// end alert

//priview images
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
//end priview images