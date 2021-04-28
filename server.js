const express=require('express')
const app=express()
const server=require('http').Server(app)
const{v4:uuidv4}=require('uuid')
const io=require('socket.io')(server)
const {ExpressPeerServer}=require('peer')
const peerServer=ExpressPeerServer(server,{
    debug:true,
})
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))

app.set('view engine','ejs')

app.use('/peerjs',peerServer)

let a

let b

// app.get('/',(req,res)=>{
//   res.render('enter')

// })

app.post('/go', (req, res)=> {
  a=req.body.name;
  res.render('room',{roomId:req.params.room,name:a})
  
});


app.get('/Sveta',(req,res)=>{
    b=req.params.room
    res.render('enter')

})


// app.get(`${b}`,(req,res)=>{
//   res.render('room',{roomId:req.params.room,name:a})
// })


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.broadcast.to(roomId).emit('user-connected', userId);
      // messages
      socket.on('message', (message,userName) => {
        //send message to the same room
        io.to(roomId).emit('createMessage', message,userName)
    }); 
  
    socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-disconnected', userId)
      })
    })
  })


server.listen(3000)