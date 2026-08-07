import productModel from "../models/product.model.js";

export const getProducts = async(req,res) => {
    try {
        const products = await productModel.find()

        res.status(200).json({
        status:'success',
        payload: products
        })
    } catch(error){
        console.error("Error al obtener productos", error);

        res.status(500).json({
            status:'error',
            message: 'No se pudieron obtener los productos'
        })
    }
}


export const getProductById= async(req,res)=>{
    try{
        const {pid}=req.params
        const product= await productModel.findById(pid)

        if (!product){
            return res.status(404).json({
                status:'error',
                message: 'Producto no encontrado'
            })
        }
        res.status(200).json({
            status: 'success',
            payload: product
        })
    } catch(error){
        console.error('Error al buscar producto: ',error)

        res.status(400).json({
            status: 'error',
            message: 'ID de producto inválido'
        })
    }
}


export const createProduct= async(req,res)=>{
    try{
        const{
            title, description, code, price, status= true, stock, category, thumbnails= []
        } = req.body;
        if (
            !title||!description||!code||
            price===undefined||stock===undefined||!category
        ){
            return res.status(400).json({
                status:'error',
                message:'Faltan campos obligatorios'
            })
        }
        const newProduct= await productModel.create({
            title, description, code, price, status, stock, category, thumbnails
        })

        return res.status(201).json({
            status:'success',
            payload: newProduct
        })
    } catch (error){
        console.error('Error al crear producto:', error)

        if(error.code === 11000){
            return res.status(400).json({
                status:'error',
                message:'Ya existe un producto con ese código'
            })
        }
        return res.status(400).json({
            status:'error',
            message: 'No se pudeo crear el producto'
        })
    }
}


export const updateProduct = async(req, res)=>{
    try{
        const{pid} = req.params
        const updates = req.body
        
        // evita modificar el id  
        delete updates._id 

        const updatedProduct = await productModel.findByIdAndUpdate(
            pid, updates, {
                new: true, runValidators: true
            }
        )
        if(!updatedProduct){
            return res.status(404).json({
                status: 'error',
                messagge: 'Producto no encontrado'
            })
        }
        return res.status(200).json({
                status: 'success',
                messagge: updateProduct
        })
    } catch(error){
        console.error('Error al actulizar el producto: ', error)

        if(error.code===11000){
            return res.status(400).json({
                status: 'error',
                messagge: 'Ya existe un producto con ese código'
            })
        }
        return res.status(400).json({
            status: "error",
            message: "No se pudo actualizar el producto"
        });
    }
}


export const deleteProduct = async(req,res)=>{
    try{
        const {pid}= req.params
        const deletedProduct= await productModel.findByIdAndDelete(pid)

        if (!deletedProduct){
            return res.status(404).json({
                status:'error',
                message: 'Producto no encontrado'
            })
        }
        return res.status(200).json({
                status:'success',
                message: 'Producto eliminado correctamente',
                payload: deletedProduct
        })
    } catch(error){
        console.error('Error al eliminar producto: ',error)
        return res.status(400).json({
                status:'error',
                message: 'ID de producto invalido'
        })
    }
}