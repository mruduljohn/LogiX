import { create } from 'zustand';
import { addBox, getBoxes, signIn, signOut } from '../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exportService } from '../services/exportService';
import { supabase } from '../services/supabase';

// Create store with Zustand
const useStore = create((set, get) => ({
  // User state
  user: null,
  isLoading: false,
  authError: null,
  
  // Boxes state
  boxes: [],
  loadingBoxes: false,
  boxesError: null,
  
  // Theme state
  darkMode: false,
  
  // Initialize store
  initialize: async () => {
    try {
      // Get dark mode preference
      const darkMode = await AsyncStorage.getItem('darkMode');
      set({ darkMode: darkMode === 'true' });
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      set({ user });
      
      // Subscribe to auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        set({ user: session?.user ?? null });
      });
      
      // Load boxes
      get().fetchBoxes();
    } catch (error) {
      console.error('Error initializing store:', error);
    }
  },
  
  // Login action
  login: async (email, password) => {
    set({ isLoading: true, authError: null });
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        set({ authError: error.message, isLoading: false });
        return { success: false, error: error.message };
      }
      
      set({ 
        user: data.user, 
        isLoading: false,
        authError: null 
      });
      
      return { success: true };
    } catch (error) {
      set({ authError: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Logout action
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await signOut();
      set({ user: null, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Fetch boxes
  fetchBoxes: async () => {
    set({ loadingBoxes: true, boxesError: null });
    
    try {
      const { data, error } = await getBoxes();
      
      if (error) {
        set({ boxesError: error.message, loadingBoxes: false });
        return { success: false, error: error.message };
      }
      
      set({ 
        boxes: data, 
        loadingBoxes: false,
        boxesError: null 
      });
      
      return { success: true, data };
    } catch (error) {
      set({ boxesError: error.message, loadingBoxes: false });
      return { success: false, error: error.message };
    }
  },
  
  // Add a new box
  addNewBox: async (boxData) => {
    set({ loadingBoxes: true, boxesError: null });
    
    try {
      // Add worker_id from current user
      const currentUser = get().user;
      const boxWithWorker = {
        ...boxData,
        worker_id: currentUser?.id
      };
      
      const { data, error } = await addBox(boxWithWorker);
      
      if (error) {
        set({ boxesError: error.message, loadingBoxes: false });
        return { success: false, error: error.message };
      }
      
      // Update boxes list with the new box
      const updatedBoxes = [data[0], ...get().boxes];
      set({ 
        boxes: updatedBoxes, 
        loadingBoxes: false,
        boxesError: null 
      });
      
      return { success: true, data };
    } catch (error) {
      set({ boxesError: error.message, loadingBoxes: false });
      return { success: false, error: error.message };
    }
  },
  
  // Toggle dark mode
  toggleDarkMode: async () => {
    try {
      const newDarkMode = !get().darkMode;
      await AsyncStorage.setItem('darkMode', newDarkMode.toString());
      set({ darkMode: newDarkMode });
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  },
  
  // Export data
  exportData: async ({ recipientEmail, message, filePath }) => {
    try {
      set({ isLoading: true });
      const result = await exportService.shareFile(filePath, recipientEmail, message);
      return result;
    } catch (error) {
      console.error('Error exporting data:', error);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useStore; 