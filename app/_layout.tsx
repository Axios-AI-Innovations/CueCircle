import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Text } from 'react-native';
import { store, persistor } from '@/store';
// Import Firebase to initialize it
import '@/utils/supabase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/supabase';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    console.log('Setting up auth listener...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.uid}` : 'No user');
      const authenticated = !!user;
      console.log('Setting isAuthenticated to:', authenticated);
      setIsAuthenticated(authenticated);
    });

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a365d' }}>
        <Text style={{ color: '#ffffff', fontSize: 18 }}>Checking authentication...</Text>
      </View>
    );
  }

  console.log('Rendering with isAuthenticated:', isAuthenticated);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" options={{ href: null }} />
        </>
      ) : (
        <>
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" options={{ href: null }} />
        </>
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  // Simple auth with Firebase
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
        <AppContent />
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>
  );
}