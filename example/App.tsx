import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-community/masked-view'
import { SquircleView } from 'react-native-figma-squircle'
import RNSlider, {
  SliderProps as RNSliderProps,
} from '@react-native-community/slider'

export default function App() {
  const [cornerRadius, setCornerRadius] = useState(30)
  const [cornerSmoothing, setCornerSmoothing] = useState(0.8)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <StatusBar style="light" />

        <View style={styles.sliders}>
          <Slider
            label="Corner radius"
            minimumValue={20}
            maximumValue={100}
            step={1}
            value={cornerRadius}
            onValueChange={setCornerRadius}
          />

          <View style={{ height: 24 }} />
          <Slider
            label="Corner smoothing"
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={cornerSmoothing}
            onValueChange={(value) => {
              setCornerSmoothing(Math.round(value * 100) / 100)
            }}
          />
          <View style={{ height: 24 }} />
        </View>
        <View style={styles.squircles}>
          <SquircleView
            style={styles.squircle}
            squircleParams={{
              cornerRadius,
              cornerSmoothing,
              fillColor: '#4F46E5',
              strokeColor: '#6366F1',
            }}
          />

          <MaskedView
            maskElement={
              <SquircleView
                style={StyleSheet.absoluteFill}
                squircleParams={{ cornerRadius, cornerSmoothing }}
              />
            }
          >
            <LinearGradient
              style={styles.squircle}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={['#FF1B6B', '#45CAFF']}
            />
          </MaskedView>
        </View>
      </View>
    </SafeAreaView>
  )
}

interface SliderProps extends Omit<RNSliderProps, 'ref'> {
  label: string
}

function Slider({ label, value, ...rest }: SliderProps) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sliderValue}>{value}</Text>
      </View>
      <RNSlider
        value={value}
        minimumTrackTintColor="#6e78ff"
        maximumTrackTintColor="#737373"
        {...rest}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#171717',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A3A3A3',
  },
  sliderValue: {
    fontSize: 16,
    color: '#E5E5E5',
    fontWeight: 'bold',
  },
  squircles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  squircle: {
    width: '50%',
    aspectRatio: 1,
  },
  sliders: {
    paddingTop: 28,
  },
})
