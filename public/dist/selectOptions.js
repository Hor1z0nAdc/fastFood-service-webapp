const kategóriaElement = document.getElementById("kategória")
const kategória =  document.getElementById("hidden-kategória").value
const képInput = document.getElementById("kép")
const changeImageInput = document.getElementById("image")

for(let i, j = 0; i = kategóriaElement.options[j]; j++) {
    if(i.value == kategória) {
        kategóriaElement.selectedIndex = j;
        break;
    }
}

changeImageInput.addEventListener("change", e => {
   képInput.value = changeImageInput.files[0].name
})
