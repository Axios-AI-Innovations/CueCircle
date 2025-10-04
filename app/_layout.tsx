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
import { useDispatch } from 'react-redux';
import { initializeXPSystem } from '@/store/slices/xpSlice';
import { userService } from '@/utils/firebase';
import { ThemeProvider } from '@/contexts/ThemeContext';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Setting up auth listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.uid}` : 'No user');
      
      if (user && user.emailVerified) {
        console.log('User is authenticated and verified');
        
        // Also check Firestore document for email verification
        try {
          const userData = await userService.getUser(user.uid);
          if (userData && userData.email_verified) {
            console.log('Firestore document also shows verified');
            setIsAuthenticated(true);
            
            // Initialize XP system when user is authenticated and verified
            console.log('App Layout: Initializing XP system for user:', user.uid);
            dispatch(initializeXPSystem({ userId: user.uid }));
          } else {
            console.log('Firestore document shows not verified');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.log('Error checking Firestore verification status:', error);
          setIsAuthenticated(false);
        }
      } else {
        console.log('No user or user not verified');
        setIsAuthenticated(false);
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, [dispatch]);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a365d' }}>
        <Text style={{ color: '#ffffff', fontSize: 18 }}>Checking authentication...</Text>
      </View>
    );
  }

  console.log('Rendering with isAuthenticated:', isAuthenticated);

  return (
    <Stack 
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? "(tabs)" : "auth"}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
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
        <ThemeProvider>
          <AppContent />
          <StatusBar style="auto" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}