
import * as SecureStore from 'expo-secure-store';


export async function getStoredData(key:string) {
    const result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
    }else{
      return null;
    }
   }
   export async function setStoredData( key:string, value: string) {
    await SecureStore.setItemAsync(key, value)
    
   }