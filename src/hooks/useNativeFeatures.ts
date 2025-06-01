
import { useCallback, useEffect, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { PushNotifications } from '@capacitor/push-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

export const useCamera = () => {
  const takePhoto = useCallback(async (fromGallery = false) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: fromGallery ? CameraSource.Photos : CameraSource.Camera,
      });

      return image.webPath;
    } catch (error) {
      console.error('Camera error:', error);
      throw error;
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      const permissions = await Camera.requestPermissions();
      return permissions.camera === 'granted';
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  }, []);

  return { takePhoto, requestPermissions };
};

export const useHaptics = () => {
  const light = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  }, []);

  const medium = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  }, []);

  const heavy = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    }
  }, []);

  const vibrate = useCallback(async (duration = 100) => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.vibrate({ duration });
    } else if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }, []);

  return { light, medium, heavy, vibrate };
};

export const usePushNotifications = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  const initializePush = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        await PushNotifications.register();
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Push notification setup error:', error);
    }
  }, []);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error: ', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received: ', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push action performed: ', notification);
      });
    }
  }, []);

  return { initializePush, isRegistered };
};

export const useStatusBar = () => {
  const setDark = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setStyle({ style: Style.Dark });
    }
  }, []);

  const setLight = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setStyle({ style: Style.Light });
    }
  }, []);

  const hide = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.hide();
    }
  }, []);

  const show = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.show();
    }
  }, []);

  return { setDark, setLight, hide, show };
};

export const useSplashScreen = () => {
  const hideSplash = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      await SplashScreen.hide();
    }
  }, []);

  return { hideSplash };
};

// Main hook that combines all native features
export const useNativeFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  const camera = useCamera();
  const haptics = useHaptics();
  const pushNotifications = usePushNotifications();
  const statusBar = useStatusBar();
  const splashScreen = useSplashScreen();

  const initializeNativeFeatures = useCallback(async () => {
    // Check if running as native app
    setIsNative(Capacitor.isNativePlatform());
    
    // Check if running as PWA
    setIsPWA(window.matchMedia('(display-mode: standalone)').matches);

    // Initialize push notifications if native
    if (Capacitor.isNativePlatform()) {
      await pushNotifications.initializePush();
      await statusBar.setDark();
      await splashScreen.hideSplash();
    }
  }, [pushNotifications, statusBar, splashScreen]);

  return {
    isNative,
    isPWA,
    initializeNativeFeatures,
    camera,
    haptics,
    pushNotifications,
    statusBar,
    splashScreen
  };
};
