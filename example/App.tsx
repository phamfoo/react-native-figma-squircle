import React, { PropsWithChildren } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView, {
  MaskedViewProps,
} from '@react-native-community/masked-view'
import { SquircleView } from 'react-native-figma-squircle'

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#171717',
      }}
    >
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingHorizontal: 8,
          alignItems: 'center',
        }}
      >
        <ContentColumn>
          <Label>{`Without\n corner smoothing`}</Label>
          <Spacer />

          <GradientView
            maskElement={
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { borderRadius: 48, backgroundColor: '#000' },
                ]}
              />
            }
          />

          <Spacer />

          <Pressable style={{ width: '100%' }}>
            {({ pressed }) => {
              return (
                <View
                  style={{
                    paddingVertical: 22,
                    alignItems: 'center',
                    borderRadius: 18,
                    backgroundColor: pressed ? '#3730A3' : '#4F46E5',
                  }}
                >
                  <ButtonText>Button</ButtonText>
                </View>
              )
            }}
          </Pressable>
        </ContentColumn>

        <ContentColumn>
          <Label>{`With\n corner smoothing`}</Label>
          <Spacer />

          <GradientView
            maskElement={
              <SquircleView
                style={StyleSheet.absoluteFill}
                squircleParams={{ cornerRadius: 48, cornerSmoothing: 1 }}
              />
            }
          />

          <Spacer />

          <Pressable style={{ width: '100%' }}>
            {({ pressed }) => {
              return (
                <SquircleView
                  style={{
                    paddingVertical: 22,
                    alignItems: 'center',
                  }}
                  squircleParams={{
                    cornerRadius: 18,
                    cornerSmoothing: 1,
                    fillColor: pressed ? '#3730A3' : '#4F46E5',
                  }}
                >
                  <ButtonText>Button</ButtonText>
                </SquircleView>
              )
            }}
          </Pressable>
        </ContentColumn>
      </View>
    </View>
  )
}

function ContentColumn({ children }: PropsWithChildren<{}>) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
      }}
    >
      {children}
    </View>
  )
}

function GradientView({
  maskElement,
}: {
  maskElement: MaskedViewProps['maskElement']
}) {
  return (
    <MaskedView
      style={{ width: '100%', aspectRatio: 1 }}
      maskElement={maskElement}
    >
      <LinearGradient
        style={StyleSheet.absoluteFill}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={['#FF1B6B', '#45CAFF']}
      />
    </MaskedView>
  )
}

function Spacer() {
  return <View style={{ height: 24 }} />
}

function Label({ children }: PropsWithChildren<{}>) {
  return (
    <Text
      style={{
        fontWeight: '700',
        color: '#D1D5DB',
        fontSize: 16,
        textAlign: 'center',
      }}
    >
      {children}
    </Text>
  )
}

function ButtonText({ children }: PropsWithChildren<{}>) {
  return (
    <Text
      style={{
        color: '#E0E7FF',
        fontWeight: 'bold',
      }}
    >
      {children}
    </Text>
  )
}
