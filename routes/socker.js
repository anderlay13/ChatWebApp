
let messageHolder = document.querySelector("#messageHolder")
let chatControls = document.querySelector("#chatControls")
let messageToSend = chatControls.querySelector("input")

chatControls.addEventListener("submit", (e) => {
    e.preventDefault();
    if (messageToSend.value !== "") {
        sendMessage(messageToSend.value)
        messageToSend.value = ""
    }
})

const username = "Invitado"

// const username = document.cookie
//   .split('; ')
//   .find(row => row.startsWith('senderName='))
//   .split('=')[1];
/*

messagehistory= {
    timestamp:{SenderName:"Name",
                messageContent:"textsent",
                socketioid:"socketioid"}
}
*/
//recieves an object with one or multiple messages
function appendNewMessage(message, mymessage = false) {
    Object.keys(message).forEach((timestamp) => {
        console.log("ini", message, timestamp)
        let messageBody = message[timestamp]
        messageBody.senderName

        let messageItem = document.createElement("div")
        messageItem.classList.add(`messageItem`)
        mymessage ? (messageItem.classList.add(`Own`)) : "";

        let messageContent = document.createElement("li")
        messageContent.classList.add('messageContent')
        let messageMetadata = document.createElement("span")
        messageMetadata.classList.add('messageMetadata')


        messageMetadata.innerText = `${messageBody.senderName} · ${timestamp}`

        console.log("msgcont", messageBody.messageContent)
        messageContent.innerText = messageBody.messageContent
        messageItem.appendChild(messageContent)
        messageItem.appendChild(messageMetadata)
        messageHolder.appendChild(messageItem)

        console.log(timestamp, message[timestamp]);
    });

}
// btn = document.getElementById("btn")

// btn.click()
function getCurrentTime() {
    today = new Date();
    hour = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    date = new Date().toLocaleDateString("co-CO") + " " + hour //T instead of " "

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

var socket = io.connect(window.location.host);

console.log("diadhawd")
socket.emit("getChatHistory")
socket.on("runOnceDevLoad", (chatHistory)=>{
    console.log("inicc dev", chatHistory)

    appendNewMessage(chatHistory)

})



function sendMessage(messageText) {
    let message = {}
    message[getCurrentTime()] = { senderName: username, messageContent: messageText }
    appendNewMessage(message, true)
    socket.emit("sendMessage", message)
}
// socket.emit("alert", "hola")

socket.on("newConnection", (data) => {
    // alert(data)
})
socket.on("newMessage", (data) => {
    appendNewMessage(data)

})

socket.on("log", (data) => {
    console.log(data)
})