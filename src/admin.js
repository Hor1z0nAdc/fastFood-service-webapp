const axios = require("axios")

const init = () => {
  const orderTableBody = document.querySelector("#orderTableBody")
  let orders = []
  let markup

  axios.get("/admin/rendelesek", {
    headers: {'X-Requested-With': 'XMLHttpRequest'}
  }).then( res => {
    orders = res.data
    markup = generateMarkup(orders)
    orderTableBody.innerHTML = markup
  }).catch( err => {
      console.log(err)
  })

  function renderItems(items) {
    let parsedItems = Object.values(items)
    return parsedItems.map((menuItem) => {
        return `
            <p>${ menuItem.item.név } - ${ menuItem.quantity } pcs </p>
        `
    }).join('')
  }

  function generateMarkup(orders) {
    return orders.map(order => {
      return `
          <tr>
          <td class="border px-4 py-2 text-green-900">
              <p>${ order._id }</p>
              <div>${ renderItems(order.termékek) }</div>
          </td>
          <td class="border px-4 py-2">${ order.vásárlóId.email }</td>
          <td class="border px-4 py-2">${ order.cím }</td>
          <td class="border px-4 py-2">
              <div class="inline-block relative w-64">
                  <form action="/admin/order/status" method="POST">
                      <input type="hidden" name="orderId" value="${ order._id }">
                      <select name="status" onchange="this.form.submit()"
                          class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                          <option value="order_placed"
                              ${ order.állapot === 'order_placed' ? 'selected' : '' }>
                              Placed</option>
                          <option value="confirmed" ${ order.állapot === 'confirmed' ? 'selected' : '' }>
                              Confirmed</option>
                          <option value="prepared" ${ order.állapot === 'prepared' ? 'selected' : '' }>
                              Prepared</option>
                          <option value="delivered" ${ order.állapot === 'delivered' ? 'selected' : '' }>
                              Delivered
                          </option>
                          <option value="completed" ${ order.állapot === 'completed' ? 'selected' : '' }>
                              Completed
                          </option>
                      </select>
                  </form>
                  <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20">
                          <path
                              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                  </div>
              </div>
          </td>
          <td class="border px-4 py-2">
              ${ "ido"}
          </td>
      </tr>
  `
  }).join('')
  }
}

module.exports = { init }