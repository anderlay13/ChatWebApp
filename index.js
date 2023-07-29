const express = require("express")
const app = express()
// const morgan = require("morgan")
// const parser = require("body-parser")
const socketio = require("socket.io")
const fetch = require("sync-fetch")
//const tflops = require("./tflops")
app.port = process.env.PORT || 3001

var server = app.listen(app.port, () => console.log(`server port ${app.port}`))

app.use(express.json())
// app.use(morgan("dev"))

// Precaucion settea el header de staticos en recibir peticiones https automaticamente (hsts)
// Si pasa el error Empty Response quitar el segundo argumento de express.static para solo tener 1 original

app.use(express.static("routes"))

io=socketio(server)

//gets date
function getCurrentTime() {
	today=new Date();
    hour=today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    
    //date = new Date().toLocaleDateString("co-CO") + " " + hour //T instead of " "

	aap=today.toLocaleDateString("co-CO").split("/").reverse(); 
    bigdate=`${aap[0]}-${aap[2]}-${aap[1]}`
    
    date = bigdate + " " + hour //T instead of " "

	while (date.indexOf("/") != -1) {
		date = date.replace("/", "-")
	}
	while (date.indexOf(":") != -1) {
		date = date.replace(":", "-")
	}
	while (date.indexOf(".") != -1) {
		date = date.replace(".", "-")
	}
	return date
}

/* requ=fetch("https://    wdaawdthe notifier awdawd  .firebaseio.com/queue.json",{
				method: 'patch',
				body:    JSON.stringify(queue),
				headers: { 'Content-Type': 'application/json' },
			})
			if(requ.status!=200){
				io.sockets.emit("notify", {title:"Something went wrong", options:{body:"Saving queue got "+ requ.status + " status."}})
			}
 */

/*

messagehistory= {
	timestamp:{SenderName:"Name",
	Message:"textsent",
	socketioid:"socketioid"}
}
*/
let messageHistory = fetch("https://chatwebapp-4jf59-default-rtdb.firebaseio.com/messageHistory.json").json()

app.get("/messagehistory", (req, res) => {
	res.json(messageHistory)
})

app.get("/reloadDatabase", (req, res) => {
	messageHistory = fetch("https://chatwebapp-4jf59-default-rtdb.firebaseio.com/messageHistory.json").json();
	res.json(messageHistory)
})

app.get("/resetDatabase", (req, res) => {
	data={
		'*Inicio': { messageContent: 'Inicio del chat', senderName: ' ' }
	}
	requ = fetch("https://chatwebapp-4jf59-default-rtdb.firebaseio.com/messageHistory.json", {
		method: 'put',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	})
	messageHistory = fetch("https://chatwebapp-4jf59-default-rtdb.firebaseio.com/messageHistory.json").json();

	res.json(messageHistory)
})






// if (requ.status != 200) {
// 	io.sockets.emit("notify", { title: "Something went wrong", options: { body: "Saving queue got " + requ.status + " status." } })
// }
io.on("connection", (socket) => {
	console.log("newconnection", "socket")
	socket.emit("ConnectionSuccess")

	socket.on("getChatHistory", (data) => {
		console.log("chathistory fetched", messageHistory)
		
		socket.emit("runOnceDevLoad", messageHistory)

	})
	socket.on("sendMessage", (data) => {
		// data={senderName, messageContent}
		timestamp = getCurrentTime()
		let message = {}
		Object.keys(data).forEach((timestampr) => {
			console.log("indawdi", data, timestampr)
			// messageHistory[timestamp] = data[timestampr]
			message[timestampr] = data[timestampr]})   //message[timestamp] for more secure 
		messageHistory={...messageHistory, ...message}

		requ = fetch("https://chatwebapp-4jf59-default-rtdb.firebaseio.com/messageHistory.json", {
			method: 'patch',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' },
		})
		// if(requ.status!=200){
		// 	io.sockets.emit("notify", {title:"Something went wrong", options:{body:"Saving queue got "+ requ.status + " status."}})
		// }
		console.log("new message emitted " + message, Object.keys(message), Object.values(message), data, timestamp)
		
		socket.broadcast.emit("newMessage", data)
	})
	socket.on("reloadDatabase", (data)=>{
		messageHistory = fetch("https://chatwebapp-4jf59-default-rtdb.firebaseio.com/messageHistory.json").json()
	})
})