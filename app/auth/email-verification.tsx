import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react-native';
import { auth } from '@/utils/supabase';
import { sendEmailVerification, reload, onAuthStateChanged } from 'firebase/auth';

export default function EmailVerificationScreen() {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    // Listen for auth state changes to detect email verification
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Reload user to get latest verification status
        await reload(currentUser);
        
        if (currentUser.emailVerified) {
          Alert.alert(
            'Email Verified! 🎉',
            'Your email has been verified successfully.',
            [
              {
                text: 'Continue',
                onPress: () => router.replace('/(tabs)')
              }
            ]
          );
        }
      }
    });

    // Also check verification status periodically
    const interval = setInterval(async () => {
      if (user) {
        await reload(user);
        if (user.emailVerified) {
          Alert.alert(
            'Email Verified! 🎉',
            'Your email has been verified successfully.',
            [
              {
                text: 'Continue',
                onPress: () => router.replace('/(tabs)')
              }
            ]
          );
        }
      }
    }, 3000); // Check every 3 seconds

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [user]);

  const handleResendVerification = async () => {
    if (!user) return;

    setResending(true);
    try {
      await sendEmailVerification(user);
      Alert.alert(
        'Verification Email Sent 📧',
        'Please check your email and click the verification link.'
      );
    } catch (error: any) {
      console.error('Resend verification error:', error);
      Alert.alert(
        'Error',
        'Failed to resend verification email. Please try again.'
      );
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await reload(user);
      const currentUser = auth.currentUser;
      
      if (currentUser && currentUser.emailVerified) {
        Alert.alert(
          'Email Verified! 🎉',
          'Your email has been verified successfully.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert(
          'Not Verified Yet',
          'Please check your email and click the verification link, then try again.'
        );
      }
    } catch (error: any) {
      console.error('Check verification error:', error);
      Alert.alert(
        'Error',
        'Failed to check verification status. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? You can sign back in after verifying your email.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            auth.signOut();
            router.replace('/auth/signin');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Mail size={64} color="#48bb78" />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification link to:
        </Text>
        <Text style={styles.email}>{user?.email}</Text>

        <Text style={styles.description}>
          Please check your email and click the verification link to activate your account.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleCheckVerification}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <CheckCircle size={20} color="#ffffff" />
                <Text style={styles.primaryButtonText}>I've Verified My Email</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleResendVerification}
            disabled={resending}
          >
            {resending ? (
              <ActivityIndicator color="#48bb78" />
            ) : (
              <>
                <RefreshCw size={20} color="#48bb78" />
                <Text style={styles.secondaryButtonText}>Resend Verification Email</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a365d',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#48bb7820',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#48bb78',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  actions: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#48bb78',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#48bb78',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#48bb78',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    padding: 12,
  },
  signOutText: {
    color: '#a0aec0',
    fontSize: 14,
    textAlign: 'center',
  },
});
