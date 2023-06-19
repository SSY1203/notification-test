/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import messaging from '@react-native-firebase/messaging';

// Background, Quit 상태일 경우
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[Background Remote Message]', remoteMessage);
});

const App: () => Node = () => {
  const [state, setState] = useState(false);

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('[FCM Token] ', fcmToken);
  };

  // Foreground 상태인 경우
  useEffect(() => {
    getFcmToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('[Remote Message] ', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  const onToggleSubscibe = () => {
    setState(!state);
    if (state) {
      callApiSubscribeTopic();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onToggleSubscibe} style={styles.button}>
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
