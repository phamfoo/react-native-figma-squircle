import * as React from 'react'
import { ViewProps, View, StyleSheet } from 'react-native'
import { PropsWithChildren, useState } from 'react'
import Svg, { Color, Path } from 'react-native-svg'
import { getSvgPath } from 'figma-squircle'

interface SquircleViewProps extends ViewProps, SquircleBackgroundProps {}

function SquircleView({
  cornerRadius,
  cornerSmoothing,
  fillColor,
  children,
  ...rest
}: PropsWithChildren<SquircleViewProps>) {
  return (
    <View {...rest}>
      <SquircleBackground
        cornerRadius={cornerRadius}
        cornerSmoothing={cornerSmoothing}
        fillColor={fillColor}
      />
      {children}
    </View>
  )
}

interface SquircleBackgroundProps {
  cornerRadius: number
  cornerSmoothing: number
  fillColor?: Color
}

function SquircleBackground({
  cornerRadius,
  cornerSmoothing,
  fillColor = '#000',
}: SquircleBackgroundProps) {
  const [squircleSize, setSquircleSize] =
    useState<{ width: number; height: number } | null>(null)

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      onLayout={(e) => {
        setSquircleSize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })
      }}
    >
      <Path
        d={
          squircleSize
            ? getSvgPath({
                width: squircleSize.width,
                height: squircleSize.height,
                cornerSmoothing,
                cornerRadius,
              })
            : ''
        }
        fill={fillColor}
      />
    </Svg>
  )
}

export { SquircleView }
