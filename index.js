/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

// Handle background push notification
const handleBackgroundNotification = async remoteMessage => {
  console.log('Background Notification:', remoteMessage);
  // Perform background tasks or schedule local notifications
  PushNotification.localNotification({
    channelId: 'default',
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
  });
};

// Background push notification listener
messaging().setBackgroundMessageHandler(handleBackgroundNotification);

AppRegistry.registerComponent(appName, () => App);
