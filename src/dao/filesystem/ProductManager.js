import fs from "node:fs/promises";
import crypto from "node:crypto";

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(pid) {
        const products = await this.getProducts();

        return products.find(
            product => product.id === pid
        );
    }

    async createProduct(productData) {
        const products = await this.getProducts();

        const newProduct = {
            id: crypto.randomUUID(),
            ...productData
        };

        products.push(newProduct);

        await fs.writeFile(
            this.path,
            JSON.stringify(products, null, 2)
        );

        return newProduct;
    }

    async updateProduct(pid, updates) {
        const products = await this.getProducts();

        const index = products.findIndex(
            product => product.id === pid
        );

        if (index === -1) {
            return null;
        }

        products[index] = {
            ...products[index],
            ...updates,
            id: products[index].id
        };

        await fs.writeFile(
            this.path,
            JSON.stringify(products, null, 2)
        );

        return products[index];
    }

    async deleteProduct(pid) {
        const products = await this.getProducts();

        const product = products.find(
            product => product.id === pid
        );

        if (!product) {
            return null;
        }

        const updatedProducts = products.filter(
            product => product.id !== pid
        );

        await fs.writeFile(
            this.path,
            JSON.stringify(updatedProducts, null, 2)
        );

        return product;
    }
}