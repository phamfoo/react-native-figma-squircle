import * as React from 'react'
import { ViewProps, View, StyleSheet } from 'react-native'
import { PropsWithChildren, useState } from 'react'
import Svg, { Color, Path, LinearGradient, Stop, Defs } from 'react-native-svg'
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
  linear?: {
    colors: Color[],
    locations?: number[],
    start?: { x: number, y: number },
    end?: { x: number, y: number }
  }
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
  linear
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
          fill={linear ? "url(#paint0_linear)" : fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {linear && (
          <Defs>
            <LinearGradient
              id="paint0_linear"
              x1={`${(linear.start?.x || 0.5) * 100}%`}
              y1={`${(linear.start?.y || 0) * 100}%`}
              x2={`${(linear.end?.x || 0.5) * 100}%`}
              y2={`${(linear.end?.y || 1) * 100}%`}
              gradientUnits="userSpaceOnUse"
            >
              {linear.locations ? linear.locations.map((loc,i) => 
                  <Stop key={`stop${i}`} offset={`${loc}`} stopColor={linear.colors[i]} />) : 
              Array(linear.colors.length).fill(0).map((_a,i) => 
                  <Stop key={`stop${i}`} offset={`${((1/(linear.colors.length - 1)) * i).toFixed(1)}`} stopColor={linear.colors[i]} />)
              }
            </LinearGradient>
          </Defs>
        )}
      </Svg>
    </View>
  )
}

export { SquircleView }
export type { SquircleParams }
