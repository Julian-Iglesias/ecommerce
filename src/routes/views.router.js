import {Router} from 'express'
import productModel from "../models/product.model.js"
import cartModel from '../models/cart.model.js'

const router = Router()

router.get('/products', async(req,res)=>{
    try{
        const limit = parseInt(req.query.limit)||10
        const page = parseInt(req.query.page)||1

        const skip=(page-1)*limit
        const products=await productModel.find().skip(skip).limit(limit).lean()

        const totalProducts = await productModel.countDocuments()
        const totalPages = Math.ceil(totalProducts/limit)
        const hasPrevPage = page>1
        const hasNextPage = page<totalPages

        res.render('products', {
            products, page, totalPages, hasPrevPage,hasNextPage,
            prevLink: hasPrevPage ?`/products?limit=${limit}&page=${page - 1}` : null,
            nextLink: hasNextPage ? `/products?limit=${limit}&page=${page + 1}`  : null
          
        })
    } catch (error){
        console.error('Error al renderizar productos: ',error)
        res.status(500).send('Error al cargar los productos')
    }
})


router.get('/products/:pid', async(req,res)=>{
    try{
        const {pid}= req.params
        const product= await productModel.findById(pid).lean()
        if(!product){
            return res.status(404).send('Producto no encontrado')
        }
        res.render('productDetail',{product})
    } catch (error){
        console.error('Error al cargar detalle del producto: ', error)
        res.status(400).send('ID de producto invalido')
    }
})


router.get('/carts/:cid', async(req,res)=>{
    try{
        const {cid}= req.params
        const cart= await cartModel.findById(cid).populate('products.product').lean()
        
        if(!cart){
            return res.status(404).send('Carrito no encontrado')
        }
        res.render('cart',{cart})
    } catch (error){
        console.error('Error al cargar el carrito: ', error)
        res.status(400).send('ID de carrito invalido')
    }
})


export default router;