import { createContext, useState, useEffect, ReactNode, JSX } from 'react';
import axios from 'axios';

type Product = {
  _id: string;
  title: string;
  imageCover: string;
  ratingsAverage: number;
  price: number;
};

type ProductsContextType = {
  data: Product[];
  renderStars: (rating: number) => JSX.Element[];
};

export const productsContext = createContext<ProductsContextType | null>(null);

type ProductsProviderProps = {
  children: ReactNode;
};

export default function ProductsProvider({ children }: ProductsProviderProps) {
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get('https://ecommerce.routemisr.com/api/v1/products')
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const renderStars = (rating: number): JSX.Element[] => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fa-star ${index < rating ? 'fas text-yellow-400' : 'far text-gray-400'}`}
      ></i>
    ));
  };

  return (
    <productsContext.Provider value={{ data, renderStars }}>
      {children}
    </productsContext.Provider>
  );
}
