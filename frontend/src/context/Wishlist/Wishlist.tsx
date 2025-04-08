import axios from 'axios';
import { createContext, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { authContext } from '../Auth/Auth';

interface WishlistContextType {
  addToWishlist: (id: string) => Promise<any>;
  getWishlist: () => Promise<any>;
  deleteWishlistItem: (id: string) => Promise<any>;
}

export const wishlistContext = createContext<WishlistContextType | null>(null);

import { ReactNode } from 'react';

interface WishlistContextProviderProps {
  children: ReactNode;
}

export default function WishlistContextProvider(props: WishlistContextProviderProps) {
  const auth = useContext(authContext);
  const userToken = auth?.userToken;

  const headers = {
    token: userToken,
  };
  const URL = 'https://ecommerce.routemisr.com/api/v1/wishlist';

  function addToWishlist(id: string) {
    const data = {
      productId: id,
    };

    const config = {
      method: 'post',
      url: URL,
      headers: headers,
      data: data,
    };
    return toast.promise(
      axios(config)
        .then((response) => response.data)
        .catch((error) => {
          throw error;
        }),
      {
        loading: 'Adding product to wishlist...',
        success: 'Product added successfully!',
        error: 'Error adding product',
      }
    );
  }

  function deleteWishlistItem(id: string) {
    const config = {
      method: 'delete',
      url: `${URL}/${id}`,
      headers: headers,
    };

    return toast.promise(
      axios(config)
        .then((response) => response.data)
        .catch((error) => {
          throw error;
        }),
      {
        loading: 'Removing product from wishlist...',
        success: 'Product removed successfully!',
        error: 'Error removing product',
      }
    );
  }

  function getWishlist() {
    let config = {
      method: 'get',
      url: URL,
      headers: headers,
    };

    return axios(config)
      .then((response) => response.data.data)
      .catch((error) => {
        throw error;
      });
  }

  return (
    <wishlistContext.Provider
      value={{ addToWishlist, getWishlist, deleteWishlistItem }}
    >
      {props.children}
    </wishlistContext.Provider>
  );
}
