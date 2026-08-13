import ProductMongo from "../dao/mongo/ProductMongo.js"
const productDao= new ProductMongo()


// GET /api/products
export const getProducts = async(req,res) => {
    try {
        const limit = parseInt(req.query.limit)||10
        const page = parseInt(req.query.page)||1
        const query = req.query.query
        const sort = req.query.sort
        const filter={}
        
        if(query){
            if(query==='available'){
                filter.stock={$gt:0}
            } else{
                filter.category=query
            }
        }

        let sortOption={}
        if(sort==='asc'){
            sortOption.price=1
        }
        if(sort==='desc'){
            sortOption.price=-1
        }
        const skip=(page-1)*limit

        const products = await productDao. getProducts(filter, sortOption, skip, limit)

        const totalProducts = await productDao.countProducts(filter)
        const totalPages = Math.ceil(totalProducts/limit)
        const hasPrevPage=page>1 && page <= totalPages
        const hasNextPage=page<totalPages

        const buildLink=(targetPage)=>{
            const params = new URLSearchParams()
            param.set('limit',limit)
            params.set('page', targetPage)
            if (query){
                params.set('query',query)
            }

            if(sort){
                params.set('sort',sort)
            }
            return `/api/products?${params.toString()}`
        }

        return res.status(200).json({
            status:'success',
            payload: products, totalPages,
            prevPage: hasPrevPage ? page - 1:null,
            nextPage: hasNextPage ? page + 1:null,
            page, hasPrevPage, hasNextPage,
            prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page-1}`:null,
            nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page+1}`:null
        })
    } catch(error){
        console.error("Error al obtener productos", error);

        res.status(500).json({
            status:'error',
            message: 'No se pudieron obtener los productos'
        })
    }
}


// GET /api/products/:pid
export const getProductById= async(req,res)=>{
    try{
        const {pid}=req.params
        const product= await productDao.getProductById(pid)

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


// POST /api/products
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
        const newProduct= await productDao.createProduct({
            title, description, code, price, status, stock, category, thumbnails
        })

        //socket
        const socketServer= req.app.get('socketServer')
        socketServer.emit('productsUpdated')

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


// PUT /api/products/:pid
export const updateProduct = async(req, res)=>{
    try{
        const{pid} = req.params
        const updates = {...req.body}
        
        // evita modificar el id  
        delete updates._id 

        const updatedProduct = await productDao.updateProduct(pid, updates)

        if(!updatedProduct){
            return res.status(404).json({
                status: 'error',
                messagge: 'Producto no encontrado'
            })
        }

        //socket
        const socketServer = req.app.get("socketServer");
        socketServer.emit("productsUpdated");

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


// DELETE /api/products/:pid
export const deleteProduct = async(req,res)=>{
    try{
        const {pid}= req.params
        const deletedProduct= await productDao.deleteProduct(pid)

        if (!deletedProduct){
            return res.status(404).json({
                status:'error',
                message: 'Producto no encontrado'
            })
        }

        const socketServer = req.app.get("socketServer");
        socketServer.emit("productsUpdated");

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