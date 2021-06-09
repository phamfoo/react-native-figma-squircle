import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SquircleView } from 'react-native-figma-squircle'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SquircleView
        cornerRadius={30}
        cornerSmoothing={0.8}
        style={{ width: 200, height: 200 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
