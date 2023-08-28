
let messageHolder = document.querySelector("#messageHolder")
let chatControls = document.querySelector("#chatControls")
let messageToSend = chatControls.querySelector("input")

let quickestver=false
chatControls.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (messageToSend.value !== ""  ) {
        sendMessage(messageToSend.value)
        // cleanedSpecChars=messageToSend.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x00-\x7F]/g, "");
        // if (cleanedSpecChars !=="" && quickestver){
        //     sendMessage(cleanedSpecChars)
        // }else if (cleanedSpecChars !==""){
        //     sendMessage(messageToSend.value)
        // }
        window.scrollTo(0, document.body.scrollHeight);
        messageToSend.value = ""
    }
})

let username = "Invitado"

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
    window.scrollTo(0, document.body.scrollHeight);


}
// btn = document.getElementById("btn")

// btn.click()
function getCurrentTime() {
    today = new Date();
    hour = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    //date = new Date().toLocaleDateString("co-CO") + " " + hour //T instead of " "
    aap=new Date().toLocaleDateString("co-CO").split("/").reverse(); 
    bigdate=`${aap[0]}-${aap[1]}-${aap[2]}`
    
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

var socket = io();

socket.emit("getChatHistory", (chatHistory)=>{

    clearTimeout(tOut)
    console.log("inicc dev", chatHistory)

    messageHolder.replaceChildren()
    console.log("replac")
    appendNewMessage(chatHistory)

});
let tOut

function rtout(){
    tOut=setTimeout(()=>{socket.emit("getChatHistory"); console.log("emit timeout");}, 1900)
}
rtout()
//tOut=setTimeout(()=>{socket.emit("getChatHistory"); console.log("emit timeout"); }, 1900)

console.log("diadhawd")
socket.on("runOnceDevLoad", (chatHistory)=>{

    clearTimeout(tOut)
    console.log("inicc dev", chatHistory)

    messageHolder.replaceChildren()
    console.log("replac")
    appendNewMessage(chatHistory)

})

/*
socket.on("ConnectionSuccess", ()=>{
    console.log("connected")}
)
*/


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
    // window.scrollTo(0, document.body.scrollHeight);
    appendNewMessage(data)
    

})

socket.on("log", (data) => {
    console.log(data)
})

// socket.emit("getChatHistory")

console.log("end")

 