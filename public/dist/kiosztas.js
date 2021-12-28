const hozzarendelBtn = document.getElementById("hozzarendel")
const checkboxes = document.querySelectorAll(".check")

const checkArray = Array.from(checkboxes)
hozzarendelBtn.disabled = true
hozzarendelBtn.classList.add("disabled-btn")

checkboxes.forEach(checkbox => {
    checkbox.addEventListener("click", (e) => {
        hozzarendelBtn.disabled = true
        hozzarendelBtn.classList.add("disabled-btn")

        const isChecked = checkArray.some(check => {
            return check.checked
        })
    
        if(isChecked) {
            hozzarendelBtn.disabled = false
            hozzarendelBtn.classList.remove("disabled-btn")
        }  
            
    })
})
