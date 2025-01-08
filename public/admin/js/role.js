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


//delete