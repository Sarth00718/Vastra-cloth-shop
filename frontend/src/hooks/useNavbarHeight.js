import { useContext } from 'react';
import { shopDataContext } from '../context/ShopContext';

/**
 * Custom hook to get the correct padding top based on navbar state
 * Returns the class name for padding-top that accounts for search bar
 */
export const useNavbarHeight = () => {
  const { showSearch } = useContext(shopDataContext);
  
  // Base navbar height is 64px, search bar adds 80px
  return showSearch ? 'pt-[144px]' : 'pt-[64px]';
};

export default useNavbarHeight;
