import React from "react";
import ProductCard from "../components/ProductCard";

const products = [
  { id: 1, name: "Coir Grow Bags", price: "$2.50" },
  { id: 2, name: "Coir Mats", price: "$3.80" },
  { id: 3, name: "Coir Blocks", price: "$1.20" }
];

const ProductCatalog = () => {
  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Product Catalogue</h2>

      <div className="row">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
