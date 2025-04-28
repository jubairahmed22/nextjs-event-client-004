export interface Product {
    _id: string;
    productId: string;
    title: string;
    category: string;
    subCategory?: string;
    type: string;
    productCode: string;
    Promotion: string;
    quantity: number;
    availableQuantity: number;
    bookedQuantity: number;
    price: number;
    createdAt: string;
  }
  
  export interface Category {
    _id: string;
    name: string;
    hasSubcategories?: boolean;
  }
  
  export interface SubCategory {
    _id: string;
    name: string;
    category: string;
  }
  
  export interface Filters {
    title: string;
    productId: string;
    category: string;
    subCategory: string;
    SelectedType: string;
    productCode: string;
    promotionFilter: string;
  }