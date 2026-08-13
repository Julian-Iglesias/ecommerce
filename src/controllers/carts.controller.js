import CartMongo from "../dao/mongo/cartMongo.js"
import ProductMongo from "../dao/mongo/ProductMongo.js"

const cartDao= new CartMongo()
const productDao= new ProductMongo()


// POST /api/carts
export const createCart = async(req,res) =>{
    try{
        const newCart= await cartDao.createCart()
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


// GET /api/carts
export const getCarts = async (req, res) => {
    try {
        const carts = await cartDao.getCarts()
        return res.status(200).json({
            status: "success",
            payload: carts
        });
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        return res.status(500).json({
            status: "error",
            message: "No se pudieron obtener los carritos"
        })
    }
}

// GET /api/carts/:cid
export const getCartById= async(req,res)=>{
    try{
        const {cid} = req.params
        const cart= await cartDao.getCartByIdPopulate(cid)

        if(!cart){
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            })
        }
        return res.status(200).json({
            status: 'success',
            payload: cart
        })
    } catch(error){
        console.error('Error al obtener carrito', error)
        return res.status(400).json({
            status:'error',
            message:'ID de carrito inválido'
        })
    }
}


// POST /api/carts/:cid/products/:cid
export const addProductToCart= async (req,res)=>{
    try{
        const {cid,pid} = req.params
        const cart= await cartDao.getCartById(cid)

        if (!cart) {
            return res.status(404).json({
                status:'error',
                message:'Carrito no encontrado'
            })
        }
        const product=await productDao.getProductById(pid)
        if (!product) {
            return res.status(404).json({
                status:'error',
                message:'Producto no encontrado'
            })
        }
        const productInCart = cart.products.find(
            (item) => item.product.toString()=== pid
        )

        if (productInCart){
            productInCart.quantity +=1
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            })
        }
        await cartDao.saveCart(cart)
        return res.status(200).json({
            status:'success',
            message: 'Producto agregado al carrito',
            payload: cart
        })
    } catch(error){
        console.error('Error al agregar producto al carrito: ', error)
        return res.status(400).json({
            status: 'error',
            message: 'No se pudo agregar el producto al carrito'
        })
    }
}


// DELETE /api/carts/:cid/products/:pid
export const deleteProductFromCart= async (req,res)=>{
    try{
        const {cid,pid} = req.params
        const cart= await cartDao.getCartById(cid)

        if (!cart) {
            return res.status(404).json({
                status:'error',
                message:'Carrito no encontrado'
            })
        }
        
        const productExist = cart.products.some(
            (item) => item.product.toString()=== pid
        )

        if (!productExist){
            return res.status(404).json({
                status:'error',
                message:'El producto no esta en el carrito'
            })
        }
        cart.products= cart.products.filter(
            (item)=>item.product.toString() !==pid
        )
        await cartDao.saveCart(cart)
        return res.status(200).json({
            status:'success',
            message: 'Producto eliminado del carrito',
            payload: cart
        })
    } catch(error){
        console.error('Error al eliminar el producto de carrito: ', error)
        return res.status(400).json({
            status: 'error',
            message: 'No se pudo eliminar el producto al carrito'
        })
    }
}


// PUT /api/carts/:cid
export const updateCart= async (req,res)=>{
    try{
        const {cid} = req.params
        const {products}= req.body || {}

        if (!Array.isArray(products)) {
            return res.status(400).json({
                status:'error',
                message:'products debe ser un array'
            })
        }
        
        const updateCart = await cartDao.updateCart(cid,products)

        if (!updateCart){
            return res.status(404).json({
                status:'error',
                message:'Carrito no encontrado'
            })
        }
        return res.status(200).json({
            status:'success',
            message: 'Carrito actualizado correctamente',
            payload: updateCart
        })
    } catch(error){
        console.error('Error al actualizar carrito: ', error)
        return res.status(400).json({
            status: 'error',
            message: 'No se pudo actualizar el carrito'
        })
    }
}


// PUT /api/carts/:cid/products/:pid
export const updateProductQuantity= async (req,res)=>{
    try{
        const {cid,pid} = req.params
        const {quantity}= req.body ||{}

        if (!Number.isInteger(quantity) || quantity <1) {
            return res.status(400).json({
                status:'error',
                message:'La cantidad debe ser un número mayor a 0'
            })
        }
        
        const cart = await cartDao.getCartById(cid)

        if (!cart){
            return res.status(404).json({
                status:'error',
                message:'Carrito no encontrado'
            })
        }
        const productInCart= cart.products.find(
            (item)=> item.product.toString() === pid
        )
        if(!productInCart){
            return res.status(404).json({
                status:'error',
                message: 'El producto no está en el carrito'
            })
        }
        productInCart.quantity=quantity
        await cartDao.saveCart(cart)
        return res.status(200).json({
            status:'success',
            message:'Cantidad actualizada correctamente',
            payload: cart
        })
    } catch(error){
        console.error('Error al actualizar cantidad: ', error)
        return res.status(400).json({
            status: 'error',
            message: 'No se pudo actualizar la cantidad'
        })
    }
}


// DELETE /api/carts/:cid
export const emptyCart= async (req,res)=>{
    try{
        const {cid} = req.params
        const cart= await cartDao.getCartById(cid)

        if (!cart) {
            return res.status(404).json({
                status:'error',
                message:'Carrito no encontrado'
            })
        }
        
        cart.products=[]

        await cartDao.saveCart(cart)
        
        return res.status(200).json({
            status:'success',
            message:'Carrito vaciado correctamente',
            payload: cart
        })
    } catch(error){
        console.error('Error al vaciar el carrito: ', error)
        return res.status(400).json({
            status: 'error',
            message: 'No se pudo vaciar el carrito'
        })
    }
}
