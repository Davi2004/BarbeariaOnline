import useFetchProducts from "../../hooks/useFetchProducts";
import Header from '../../components/Header/header'
import styles from './products.module.css';

const Produtos = () => {
  const { products } = useFetchProducts();
  
  return (
    <main className={styles.container}>

      <Header
        title="Produtos disponivéis"
        showVoltar
      />

      <section className={styles.products}>
        
        {products.map((product) => (

          <div key={product.id} className={styles.card}>
            
            <h2>{product.title}</h2>
            
            <a 
              href={product.permalink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.link}
            >
              <img src={product.thumbnail} alt={product.title} />
            </a>
            
            <p className={styles.price}> 
              R$ {product.price.toFixed(2)} 
            </p>
            
          </div>
          
        ))}
        
      </section>

    </main>
  );
};

export default Produtos;
