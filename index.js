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
	console.log("time measuerd")
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
let chats={
	12345678:{
		name:"Chat's Name",
		users:[132562231, 1314523243],
		chatHistory:[{
			timestamp:"2023-08-21 16-25-31",
			senderName:"Name",
			messageContent:"textsent",
			userid:"userid"
		}],
		roles:{
			"normal":[2131789, 2138917],
			"admin":[218739, 12785739]
		}
	}
}
filter4name={
	chatName:(name)=>{
	}
}
function filterName (name, nameType){
	switch (nameType){
		case "chatName":
			if (name.length>=16 ){
				return [400, "LongName"]
			}
			name.trim()
			return name

	
	}
}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

// chatConfigs={
// 	name:"chat name",
// 	profilePicture:"link here",
// 	users:[12378998, 1236990]
// }

// 12345678:{
// 	name:"Chat's Name",
// 	users:[132562231, 1314523243],
// 	chatHistory:[{
// 		timestamp:"2023-08-21 16-25-31",
// 		senderName:"Name",
// 		messageContent:"textsent",
// 		userid:"userid"
// 	}],
// 	roles:{
// 		"normal":[2131789, 2138917],
// 		"admin":[218739, 12785739]
// 	}
// }


function newChat(chatConfigs){

	protoChat = {}
	protoChat.name= filterName(chatConfigs.name, "chatName")
	protouuid= create_UUID()
	while(!!!chats[protouuid]){
		protouuid= create_UUID()
	}
	!!chatConfigs.profilePicture?false:protoChat.profilePicture

	chats[protouuid]
	// Object.assign(chats, protoChat)


}
io.on("connection", (socket) => {
	console.log("newconnection", "socket")
	socket.emit("ConnectionSuccess")

	socket.on("getChatHistory", (callback, data) => {
		console.log("chathistory fetched", messageHistory)
		
		// socket.emit("runOnceDevLoad", messageHistory)
		console.log(data, callback)
		callback(messageHistory)
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
		console.log("new message emitted " + message, Object.keys(message), Object.values(message), data, timestamp, "a")
		
		socket.broadcast.emit("newMessage", data)
	})
	socket.on("reloadDatabase", (data)=>{
		messageHistory = fetch("https://chatwebapp-4jf59-default-rtdb.firebaseio.com/messageHistory.json").json()
	})
})