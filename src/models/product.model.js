import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: Boolean,
      default: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    thumbnails: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
)

const productModel = mongoose.model("products", productSchema);

export default productModel;