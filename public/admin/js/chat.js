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
if(buttonBack)
{
    buttonBack.addEventListener("click" , () => {
        const url = `${window.location.origin}/admin/chat`;
        window.location.href = url;
    })
}
//end button-back


//checked all
const checkAll = document.querySelector("input[name='checkall']");
const checkId = document.querySelectorAll("input[name='id']");
if(checkAll)
{
    checkAll.addEventListener("click" , () => {
        if(checkId)
        {
            if(checkAll.checked)
            {
                checkId.forEach((input) => {
                    input.checked = true;
                })
            }
            else
            {
                checkId.forEach((input) => {
                    input.checked = false;
                })
            }
        }
    })
}
if(checkId)
{   
    checkId.forEach((item) => {
        item.addEventListener("click" , () => {
            const countCheckedItem = document.querySelectorAll("input[name='id']:checked").length;
            if(countCheckedItem === checkId.length)
            {
                checkAll.checked = true;
            }
            else{
                checkAll.checked = false;
            }
        })
    })
}
//end checked all

//delete-multi
const buttonDeleteMulti = document.querySelector("[button-delete-multi]");
if(buttonDeleteMulti)
{
    let arrayId = [];
    buttonDeleteMulti.addEventListener("click" , () => {
        const inputCheckedId = document.querySelectorAll("input[name='id']:checked");
        if(inputCheckedId)
        {
            
            inputCheckedId.forEach((input) => {
                const id = input.getAttribute("value");
                arrayId.push(id);
            })
        }
        const url = `${window.location.origin}/admin/chat/delete-multi?multi-id=${arrayId.join(",")} `;
        const confirmCheck = confirm("Bạn có muốn xóa những tin nhắn đã chọn hay không?");
        if(confirmCheck){
            window.location.href = url;
        }
    })
}
//end-delete-muti

//fillter
const buttonFillter = document.querySelectorAll("[fillter]");
if(buttonFillter)
{
    buttonFillter.forEach((button) => {
        button.addEventListener("click" , () => {
            const status = button.getAttribute("status");
            const url = `${window.location.origin}/admin/chat?status=${status}`;
            window.location.href = url;
        })
    })
}
//end fillter

//fillter dustbin
const buttonFillterDustbin = document.querySelectorAll("[fillter-dustbin]");
if(buttonFillterDustbin)
{
    buttonFillterDustbin.forEach((button) => {
        button.addEventListener("click" , () => {
            const status = button.getAttribute("status");
            const url = `${window.location.origin}/admin/dustbin-mess?status=${status}`;
            window.location.href = url;
        })
    })
}
//end fillter dustbin