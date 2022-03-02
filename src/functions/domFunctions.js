function mobileBtn(toggleBtn, navbarnLink) {
    if(toggleBtn != null) {
      toggleBtn.addEventListener("click", () => {
        navbarnLink.forEach(link => {
          link.classList.toggle("active")
        })
      })
    }
}

module.exports = {mobileBtn}