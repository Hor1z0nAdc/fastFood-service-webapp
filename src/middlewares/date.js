function currentDate()  {
    let today = new Date()
    today = formatDate(today)
    return today
} 

function formatDate(date) {
    let day = String(date.getDate()).padStart(2, '0')
    let month = String(date.getMonth() + 1).padStart(2, '0')
    let year = date.getFullYear()

    return year + '/' + month + '/' + day
}

module.exports = {
   formatDate,
   currentDate
}