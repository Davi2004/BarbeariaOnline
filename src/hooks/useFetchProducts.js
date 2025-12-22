import { useState, useEffect } from "react";
import productsData from '../data/products'; // Importa os dados diretamente

const useFetchProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Como os produtos já estão no formato de um array, você pode simplesmente definir o estado
    setProducts(productsData);
  }, []);

  return { products };
};

export default useFetchProducts;