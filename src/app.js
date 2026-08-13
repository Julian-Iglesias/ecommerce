import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from "node:dns";
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js';
import handlebars from 'express-handlebars'
import path from 'node:path'
import {fileURLToPath} from 'node:url';
import viewsRouter from './routes/views.router.js'
import {Server} from 'socket.io';

dotenv.config()
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const app = express()


const __filename= fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Handlebars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

// Archivos publicos
app.use(express.static(path.join(__dirname, 'public')))

// Middlewares
app.use(express.json()) // middleware
app.use(express.urlencoded({ extended: true })); //middleware para resivir los datos desde formularios

// Rutas API
app.use("/api/products", productsRouter);
app.use('/api/carts',cartsRouter)

// Ruas de vistas
app.use("/", viewsRouter);

app.get("/", (req, res) => {
  res.json({
    servidor: "funcionando",
    mongo: mongoose.connection.readyState === 1
      ? "conectado"
      : "desconectado"
  });
});

mongoose.connect(process.env.mongo_key,{dbName: 'e-commerce'})
.then(()=>{
    console.log('Coneactado a MongoDB')

    const httpServer=app.listen(8080,()=>{
      console.log('Conectado en el puerto 8080')
    })
    const socketServer=new Server(httpServer)
    
    app.set('socketServer', socketServer)

    socketServer.on('connection', (socket)=>{
      console.log('Cliente conectado por WebSocket: '+socket.id)
      socket.on('disconnect',()=>{
        console.log('Cliente desconectado: '+socket.id)
      })
    })
})
.catch((error)=>{
    console.log('Error al conenctarse a la Base de Datos', error)
})

