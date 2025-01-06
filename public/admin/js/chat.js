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
const buttonDelete = document.querySelectorAll("[button-delete]")
if(buttonDelete.length > 0)
{
    buttonDelete.forEach((item) => {
        item.addEventListener("click" , () => {
            const id = item.getAttribute("id");
            const ref = confirm("Bạn có muốn chuyển vào thùng rác hay không?");
            if(ref)
            {
                const url = `${window.location.origin}/admin/chat/delete/${id}`;
                window.location.href = url;
            }
            
        })
    })
}
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

//button-back
const buttonBack = document.querySelector("[button-back]");
buttonBack.addEventListener("click" , () => {
    const url = `${window.location.origin}/admin/chat`;
    window.location.href = url;
})
//end button-back