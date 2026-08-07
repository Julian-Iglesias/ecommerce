import mongoose from 'mongoose'

const cartSchema= new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    //ref le indica a mongoose que ese ID pertenece a
                    //la coleccion/modelo de productos.
                    //Para despues poder usar populate
                    ref: 'products',
                    required: true
                },
                quantity:{
                    type:Number,
                    required: true,
                    default:1,
                    min:1
                }
            }
        ]
    },{
        timestamps:true
    }
)
const cartModel= mongoose.model('carts', cartSchema)
export default cartModel;