import { create } from "zustand";

const API_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: "Please Fill All Fields." };
    }

    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product was Created Successfully!" };
  },
  fetchProducts: async () => {
    const res = await fetch(`${API_URL}/api/products`);
    const data = await res.json();
    set({ products: data.data });
  },
  deleteProduct: async (productId) => {
    const res = await fetch(`${API_URL}/api/products/${productId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };
    set((state) => ({
      products: state.products.filter((product) => product._id !== productId),
    }));
    return { success: true, message: data.message };
  },
  updateProduct: async (productId, updateProduct) => {
    const res = await fetch(`${API_URL}/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateProduct),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      products: state.products.map((product) =>
        product._id === productId ? data.data : product
      ),
    }));

    return { success: true, message: data.message };
  },
}));
