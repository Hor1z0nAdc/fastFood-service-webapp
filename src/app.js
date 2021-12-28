const axios = require('axios')
const Swal = require("sweetalert2")
const dateFormat = require("dateFormat")
const initAdmin = require("./admin")

const addBtn = document.querySelectorAll(".add-customer");
const cartCounter = document.querySelector("#cartCounter");
const toggleBtn = document.querySelector(".toggle-btn")
const navbarnLink = document.querySelectorAll(".nav-links")

let changeBtn = null
let deleteBtb = null
let deleteDeliveryBtn = null 
let deleteDropoffBtn = null

//Button for mobile users
if(toggleBtn != null) {
  toggleBtn.addEventListener("click", () => {
    navbarnLink.forEach(link => {
      link.classList.toggle("active")
    })
  })
}

//Handling cart update
function updateCart(termék) {
  axios.post("/update-cart", termék).then(res => {
      cartCounter.textContent = res.data.totalQuantity;
      Swal.fire({
        title:'Sikeres hozzáadás',
        text:'A megrendeléshez kattints a kosárra',
        icon: 'success',
        timer: 1700,
        showConfirmButton: false,
      })
     
  })
}

//Delete item from database
if(document.querySelectorAll(".delete-admin")) {
  deleteBtn = document.querySelectorAll(".delete-admin")
  
  deleteBtn.forEach(btn => {
    btn.addEventListener("click", e => {
      let termék = JSON.parse(btn.dataset.termék)

      Swal.fire({
        title: 'Biztosan törli a terméket?',
        showDenyButton: true,
        denyButtonText: "Nem",
        confirmButtonText: "igen",
      })
      .then(result => {
        if (result.isConfirmed) {
            axios.post("/delete-item", termék).then(res => {
              const element =  document.getElementById(res.data.id)
              element.remove()
              Swal.fire(`${res.data.termékNév} törölve!`, '', 'success')
            })
        }
      })
      
    })
  })
}

//Delete delivery from database
if(document.querySelectorAll(".deleteDropoffBtn")) {
  deleteDropoffBtn = document.querySelectorAll(".deleteDropoffBtn")
  let numberOfBtn = deleteDropoffBtn.length
  
  deleteDropoffBtn.forEach(btn => {
    btn.addEventListener("click", e => {
      let rendelés = JSON.parse(btn.dataset.rendelés)

      Swal.fire({
        title: "Biztosan kiszállította a csomagot?",
        text: `Megadott cím: ${rendelés.cím}`,
        showDenyButton: true,
        denyButtonText: "Nem",
        confirmButtonText: "igen",
      })
      .then(result => {
        if (result.isConfirmed) {
            axios.post("/futar/map/delete", rendelés).then(res => {
              const element =  document.getElementById(res.data.id)
              element.remove()
              numberOfBtn--
              if(numberOfBtn < 1) {
                window.location = window.location.protocol + "//" + window.location.host + "/futar"
              }
              else {
                Swal.fire("Sikeresen törölve!", "", "success")
              }
            })
        }
      })  
    })
  })
}

//Delete delivery man from database
if(document.querySelectorAll(".deleteDeliveryBtn")) {
  deleteDeliveryBtn= document.querySelectorAll(".deleteDeliveryBtn")
  
  deleteDeliveryBtn.forEach(btn => {
    btn.addEventListener("click", e => {
      const futár = JSON.parse(btn.dataset.futár)

      Swal.fire({
        title: 'Biztosan törli a futárt?',
        showDenyButton: true,
        denyButtonText: "Nem",
        confirmButtonText: "igen",
      })
      .then(result => {
        if (result.isConfirmed) {
            axios.post("/futarok/delete", futár).then(res => {
              const element =  document.getElementById(res.data.id)
              element.remove()
              Swal.fire(`${res.data.név} törölve!`, '', 'success')
            })
        }
      }) 
    })
  })
}

addBtn.forEach(btn => {
  btn.addEventListener("click", e => {
    let termék = JSON.parse(btn.dataset.termék);
    updateCart(termék);
  })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

let statuses = document.querySelectorAll(".állapot-opció")
let hiddenInput = document.querySelector("#hiddenInput")
let rendelés
if(hiddenInput) {
  rendelés = hiddenInput.value ? hiddenInput.value : null 
  rendelés = JSON.parse(rendelés)
} 
let idő = document.createElement("small")

function updateStatus(rendelés) {
  statuses.forEach(status => {
    status.classList.remove("kész")
    status.classList.remove("jelenlegi")
  })
  let complete = true

  statuses.forEach(status => {
    let data = status.dataset.status

    if(complete) {
        status.classList.add("kész")
    }
    if(data === rendelés.állapot) {
      complete = false
      idő.innerContent = dateFormat(rendelés.updatedAt, "shortTime")
      status.appendChild(idő)

      if(status.nextElementSibling) {
        status.nextElementSibling.classList.add("jelenlegi")
      }
    }
  })

}

if(rendelés) {
  updateStatus(rendelés)
}

//Socket
let socket = io()
if(rendelés != null) {
  socket.emit("join",`order_${rendelés._id}`)
}

let adminPath = window.location.pathname
if(adminPath.includes("admin")) {
  socket.emit("join", "adminRoom")
}

socket.on("orderUpdated", () => {
  const updatedOrder = { ...rendelés }
  updatedOrder.updatedAt = 
  updatedOrder.állapot = data.állapot
  updateStatus(updatedOrder)
  Swal.fire({
    text:'Megrendelését frissítettük.',
    icon: 'info',
    timer: 2000,
    showConfirmButton: false,
  })
})

socket.on("orderPlaced", order => {
  Swal.fire({
    text:'Új megrendelés érkezett!',
    icon: 'info',
    timer: 2000,
    showConfirmButton: false,
  })
  rendelések.unshift(order)
})
