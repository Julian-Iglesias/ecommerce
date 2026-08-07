import cartModel from '../models/cart.model.js'

export const createCart = async(req,res) =>{
    try{
        const newCart= await cartModel.create({
            products:[]
        })
        return res.status(201).json({
            status:'success',
            payload:newCart
        })
    }catch(error){
        console.error('Error al crear carrito', error)
        return res.status(500).json({
            status:'error',
            payload:'No se pudo crear el carrito'
        })
    }
}