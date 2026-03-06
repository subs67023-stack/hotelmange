import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.hotelmanager.app',
    appName: 'HotelManager',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        CapacitorCookies: {
            enabled: true,
        },
        AdMob: {
            appId: 'ca-app-pub-7859878761724621~7911608867',
        },
    }
};

export default config;
