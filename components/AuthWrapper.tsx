import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/supabase';
import { setUser, logout } from '@/store/slices/userSlice';
import { RootState } from '@/store';
import { router } from 'expo-router';
import { userService } from '@/utils/firebase';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthWrapper: Starting auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthWrapper: Auth state changed, user:', user ? user.uid : 'null');
      
      if (user) {
        try {
          console.log('AuthWrapper: Getting user data for:', user.uid);
          // Get user data from Firebase
          const userData = await userService.getUser(user.uid);
          console.log('AuthWrapper: User data:', userData);
          
          if (userData) {
            dispatch(setUser(userData));
          } else {
            // User exists in auth but not in our database
            console.log('AuthWrapper: User not found in database, redirecting to signup');
            dispatch(logout());
            router.replace('/auth/signup');
          }
        } catch (error) {
          console.error('AuthWrapper: Error fetching user data:', error);
          dispatch(logout());
          router.replace('/auth/signin');
        }
      } else {
        // No user signed in
        console.log('AuthWrapper: No user signed in, redirecting to signin');
        dispatch(logout());
        router.replace('/auth/signin');
      }
      console.log('AuthWrapper: Setting loading to false');
      setLoading(false);
    });

    return () => {
      console.log('AuthWrapper: Cleaning up auth listener');
      unsubscribe();
    };
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#48bb78" />
        <Text style={styles.loadingText}>Loading CueCircle...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Auth screens will be shown
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a365d',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 16,
  },
});
