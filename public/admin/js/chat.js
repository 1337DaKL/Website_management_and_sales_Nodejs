const trMess = document.querySelectorAll("[tr-mess]");
if (trMess.length > 0) {
    trMess.forEach((item) => {
        item.addEventListener("click", () => {
            const idMess = item.getAttribute("id-mess");
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
            console.log("Ok");
        })
    })
}
