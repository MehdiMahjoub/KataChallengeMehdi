'use strict';

//model of products

module.exports = mongoose => {
    let schema = mongoose.Schema(
         {
            name: String,
            category: String,
            sku: String,
            price: Number,
            quantity: Number,
         },
         { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Product = mongoose.model("product", schema);

    return Product;
}