
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