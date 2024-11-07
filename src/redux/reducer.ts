import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import labData from '../data/lab_data.json';

// Define the Laboratory and State types
interface FuelOilParameters {
  viscosity: string;
  sulfurContent: string;
  waterContent: string;
  flashPoint: string;
}

export interface Laboratory {
  id: number;
  name: string;
  city: string;
  cluster: string;
  availableEquipment: string[];
  fuelOilParameters: FuelOilParameters;
  status: string;
}

// Define the initial state type
type LaboratoryState = Laboratory[];

// Load data from local storage or use default lab data
const loadDataFromLocalStorage = (): LaboratoryState => {
  const localData = localStorage.getItem('data');
  return localData ? JSON.parse(localData) : labData as LaboratoryState;
};

// Save data to local storage
const saveDataToLocalStorage = (data: LaboratoryState) => {
  localStorage.setItem('data', JSON.stringify(data));
};

// Create the slice with typed actions and state
const laboratorySlice = createSlice({
  name: 'data',
  initialState: loadDataFromLocalStorage(),
  reducers: {
    addLaboratory: (state, action: PayloadAction<Laboratory>) => {
      const newItem = action.payload;
      state.push(newItem);
      saveDataToLocalStorage(state);
    },
    updateLaboratory: (state, action: PayloadAction<{ id: number; updatedData: Partial<Laboratory> }>) => {
      const { id, updatedData } = action.payload;
      const index = state.findIndex((item) => item.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...updatedData };
        saveDataToLocalStorage(state);
      }
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.splice(index, 1);
        saveDataToLocalStorage(state);
      }
    },
  },
});

export const { addLaboratory, updateLaboratory, deleteItem } = laboratorySlice.actions;
export default laboratorySlice.reducer;
