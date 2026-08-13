import productModel from "../../models/product.model.js";

export default class ProductMongo {

    async getProducts(filter = {}, sortOption = {}, skip = 0, limit = 10) {
        return await productModel
            .find(filter).sort(sortOption).skip(skip).limit(limit);
    }

    async countProducts(filter = {}) {
        return await productModel.countDocuments(filter);
    }

    async getProductById(pid) {
        return await productModel.findById(pid);
    }

    async createProduct(data) {
        return await productModel.create(data);
    }

    async updateProduct(pid, data) {
        return await productModel.findByIdAndUpdate(
            pid,
            data,
            {
                returnDocument: "after",
                runValidators: true
            }
        );
    }

    async deleteProduct(pid) {
        return await productModel.findByIdAndDelete(pid);
    }
}