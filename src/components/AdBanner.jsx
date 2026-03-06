import React, { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';

const AdBanner = () => {
  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          testingDevices: [], // Add your test device IDs here if needed
          initializeForTesting: true, // Use true for development
        });

        // Banner Ad Unit ID provided by user: ca-app-pub-7859878761724621/2188719327
        // Using Test ID initially for safety, but will provide instructions to switch
        const options = {
          adId: 'ca-app-pub-7859878761724621/2188719327', // Your Real Banner ID
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: false,
        };

        await AdMob.showBanner(options);
      } catch (error) {
        console.error('AdMob initialization error:', error);
      }
    };

    initializeAdMob();

    // Clean up banner on unmount
    return () => {
      AdMob.removeBanner();
    };
  }, []);

  return null; // The banner is handled by the native layer, so we return null
};

export default AdBanner;
