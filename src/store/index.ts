import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./slices/productsSlice";
import { authApi } from "./slices/authSlice";
import { cartApi } from "./slices/cartSlice";
import { checkoutApi } from "./slices/checkoutSlice";
import { categoriesApi } from "./slices/categoriesSlice";
import { couponsApi } from "./slices/couponsSlice";

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      authApi.middleware,
      cartApi.middleware,
      checkoutApi.middleware,
      categoriesApi.middleware,
      couponsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
