// src/redux/formSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICondicaoPagamento } from "@/interfaces/condicaoPagamento.interfaces";

interface FormState {
  formData: ICondicaoPagamento | null;
  isOpen: boolean;
}

const initialState: FormState = {
  formData: null,
  isOpen: false,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData(state, action: PayloadAction<ICondicaoPagamento | null>) {
      state.formData = action.payload;
    },
    setIsOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
});

export const { setFormData, setIsOpen } = formSlice.actions;
export default formSlice.reducer;
