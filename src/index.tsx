import * as React from 'react'
import { ViewProps, View, StyleSheet } from 'react-native'
import { PropsWithChildren, useState } from 'react'
import Svg, { Color, Path } from 'react-native-svg'
import { getSvgPath } from 'figma-squircle'

interface SquircleParams {
  cornerRadius?: number
  topLeftCornerRadius?: number
  topRightCornerRadius?: number
  bottomRightCornerRadius?: number
  bottomLeftCornerRadius?: number
  cornerSmoothing: number
  fillColor?: Color
  strokeColor?: Color
  strokeWidth?: number
}

interface SquircleViewProps extends ViewProps {
  squircleParams: SquircleParams
}

function SquircleView({
  squircleParams,
  children,
  ...rest
}: PropsWithChildren<SquircleViewProps>) {
  return (
    <View {...rest}>
      <SquircleBackground {...squircleParams} />
      {children}
    </View>
  )
}

function SquircleBackground({
  cornerRadius = 0,
  topLeftCornerRadius,
  topRightCornerRadius,
  bottomRightCornerRadius,
  bottomLeftCornerRadius,
  cornerSmoothing,
  fillColor = '#000',
  strokeColor = '#000',
  strokeWidth = 0,
}: SquircleParams) {
  const [squircleSize, setSquircleSize] =
    useState<{ width: number; height: number } | null>(null)

  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={(e) => {
        setSquircleSize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })
      }}
    >
      <Svg>
        <Path
          d={
            squircleSize
              ? getSvgPath({
                  width: squircleSize.width - strokeWidth,
                  height: squircleSize.height - strokeWidth,
                  cornerSmoothing,
                  cornerRadius,
                  topLeftCornerRadius,
                  topRightCornerRadius,
                  bottomRightCornerRadius,
                  bottomLeftCornerRadius,
                })
              : ''
          }
          translateX={strokeWidth / 2}
          translateY={strokeWidth / 2}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </Svg>
    </View>
  )
}

export { SquircleView }
export type { SquircleParams }
