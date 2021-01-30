const express = require('express')
const app = express()
const port = 3000  // we choose to listen here

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded())

global.orders = []   //global object

let states = []
states.push("ordered")
states.push("cooked")
states.push("served")
states.push("paid")

app.post('/PlaceOrder', (req, res) => {
    order = {}  //creates an empty object
    order.state = "ordered" //we create a state
    order.tableNumber = req.body["tableNumber"] //we set a property, takes the form being posted to the server, from the body object
    delete req.body.tableNumber
    order.items = req.body
    order.number = global.orders.length + 1   //Note, the order number is 1 more than the orders index in the array (because we don't want an order #0)
    global.orders.push(order)
    res.send('<html><body>Order Accepted #' + order.number + '</body></html>')
})

app.get('/view', (req, res) => {  //http request/response
    outputOrders(req, res)
})

app.get('/setState', (req, res) => {
    setOrderState(req, res)
    outputOrders(req, res)
})

app.get('/', (req, res) => {  //http request/response
    res.send('Hello world!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

path = require("path")
app.use(express.static(path.join(__dirname, 'public')));

// it’s telling express to serve static content out of the public folder - we need to create a new folder and call it public

function orderHTML(order){  
    let elements=[]
    elements.push("<tr>")
    elements.push("<td>Order#" + order.number + "</td>")
    elements.push("<td>Table#" + order.tableNumber + "</td>")
    elements.push("<td>")
    for (const key in order.items){
      quantity=order.items[key]
      if (quantity>0){
        elements.push( quantity + " * " + key + "<br>" )
      }
    }
    elements.push("</td>")
    elements.push("<td>" + order.state + "</td>")  
    elements.push("<td>" + stateButtons(order) + "</td>")
    elements.push("</tr>")
    console.log (order);
    return (elements.join(""))
  }

  function outputOrders(req,res){
    let filter=req.query["filter"]
    let ordersHTML=[]
    ordersHTML.push("<html><head><link type='text/css' rel='stylesheet' href='/css/style.css'></head><body>")
    ordersHTML.push('<table id="orders-table">')
    for (const order of global.orders){
      if (filter==null || order.state==filter){
        ordersHTML.push(orderHTML(order))    
      }
    }
    ordersHTML.push('</table>')
    ordersHTML.push('</body></html>')
    res.send(ordersHTML.join(''))
  }

function stateButtons(order) {
    let buttons = []
    for (const state of states) {
        buttons.push('<a href=/setState?orderNumber=' + order.number + '&state=' + state + '><button>Mark as ' + state + ' </button></a>')
    }
    return buttons.join(' ')
}

function setOrderState(req, res) {
    //transition state - based on a ?state=ordernum NameValue pair
    let order = global.orders[parseInt(req.query["orderNumber"]) - 1] // from parameter, order numbers are 1 based
    //we are able to locate it in the global orders
    //parseInt turns it into a number
    //order contains an order
    return (order.state = req.query["state"])
}