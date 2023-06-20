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
import messaging, {
  onMessage,
  getMessaging,
} from '@react-native-firebase/messaging';
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

      requestPermissions();
    };
    configurePushNotifications();
  }, []);

  const onSubscribeTopic = async (topic = 'dash') => {
    //   return instance.post('/push');
    const response = await messaging().subscribeToTopic(topic);
    console.log(`${topic} 구독 성공~!`);
    console.log(`${response}`);
  };

  const message = {
    data: {
      title: '청년 정책 알림이~~~',
      body: '구독과 좋아요, 알림 설정까지~',
    },
    topic: 'dash',
  };

  const onSendMessage = async () => {};

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => onSubscribeTopic('job')}
        style={styles.button}>
        <Text style={styles.text}>구독</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSendMessage()} style={styles.button}>
        <Text style={styles.text}>구독 취소</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
