const router = require("express").Router()

router.get("/", (req, res) => {
    /**per = Notification.permission
    console.log(per)
    notifi=new Notification("prueba", {"body":"hola"})
    notifi.onclick=(a)=>{
        console.log(a, "pressed")
    
    }**/
    res.sendFile(__dirname+"/index.html");
})

module.exports = router;