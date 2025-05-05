import React from 'react';
import CartModalForm from '../shared/CartModalForm';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface ModalCartProps {
  isVisible: boolean;
  onClose: () => void;
  cart: CartItem[];
}

const ModalCart: React.FC<ModalCartProps> = ({ isVisible, onClose, cart }) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 right-0 z-50 bg-white rounded-xl w-[650px] mx-3 sm:mx-auto shadow-xl">
        <div className="flex rounded-t justify-between py-6 px-5 items-center border-b shadow-md bg-rose-900">
          <h1 className="text-white text-xl font-raleway text600">
            Quote Request <span className="font-roboto">({cart.length})</span>
          </h1>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="bg-green overflow-y-auto shadow-lg">
           <CartModalForm ></CartModalForm>
        </div>
        <div className="flex mx-5"></div>
      </div>
    </>
  );
};

export default ModalCart;