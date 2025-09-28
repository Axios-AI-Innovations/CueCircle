import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Text } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { store, persistor } from '@/store';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a365d' }}>
            <Text style={{ color: '#ffffff', fontSize: 18 }}>Loading CueCircle...</Text>
          </View>
        } 
        persistor={persistor}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>
  );
}
