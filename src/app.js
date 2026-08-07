import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from "node:dns";
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js';

dotenv.config()

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express()

app.use(express.json()) // middleware
app.use(express.urlencoded({ extended: true })); //middleware para resivir los datos desde formularios

app.use("/api/products", productsRouter);
app.use('/api/carts',cartsRouter)

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
    console.log('coneactado a MongoDB')

    app.listen(8080,()=>{
    console.log('Conenctado en el puerto 8080')
    })
})
.catch((error)=>{
    console.log('Error al conenctarse a la Base de Datos', error)
})

