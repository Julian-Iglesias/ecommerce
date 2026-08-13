import {Router} from 'express'
import {createCart, getCarts, getCartById, addProductToCart, deleteProductFromCart, updateCart, updateProductQuantity, emptyCart} from '../controllers/carts.controller.js'

const router = Router()

router.post('/', createCart)
router.get('/', getCarts)
router.get('/:cid', getCartById)
router.post('/:cid/products/:pid', addProductToCart)
router.delete('/:cid/products/:pid', deleteProductFromCart)
router.put('/:cid', updateCart)
router.put('/:cid/products/:pid', updateProductQuantity)
router.delete('/:cid',emptyCart)

export default router