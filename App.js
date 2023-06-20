/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';

const App: () => Node = () => {
  const [state, setState] = useState('');

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    setState(fcmToken);
  };

  useEffect(() => {
    getFcmToken();

    const configurePushNotifications = () => {
      // Request permission for push notifications
      const requestPermissions = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
          getToken();
        }
      };

      // Get the FCM device token
      const getToken = async () => {
        const token = await messaging().getToken();
        console.log('Device Token:', token);
      };

      // Handle foreground push notification
      const handleForegroundNotification = async remoteMessage => {
        console.log('Foreground Notification:', remoteMessage);
        // Display the notification banner
        PushNotification.localNotification({
          channelId: 'default',
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
        });
      };

      // Configure push notification listeners
      // Foreground push notification listener
      messaging().onMessage(handleForegroundNotification);

      if (Platform.OS === 'android') {
        PushNotification.createChannel(
          {
            channelId: 'default',
            channelName: 'Default Channel',
            channelDescription: 'Default Notification Channel',
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          created => console.log(`createChannel default returned '${created}'`),
        );

        requestPermissions();
      }
    };

    configurePushNotifications();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>구독</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>구독 취소</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export function callApiSubscribeTopic(topic = 'dash') {
  //   return instance.post('/push');
  return messaging()
    .subscribeToTopic(topic)
    .then(() => {
      console.log(`${topic} 구독 성공!!`);
    })
    .catch(() => {
      console.log(`${topic} 구독 실패! ㅜㅜ`);
    });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default App;
