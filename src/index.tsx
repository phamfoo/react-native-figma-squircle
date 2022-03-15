import * as React from 'react'
import { ViewProps, View, StyleSheet } from 'react-native'
import { PropsWithChildren, ReactNode, useState } from 'react'
import Svg, { ClipPath, Color, Defs, Path } from 'react-native-svg'
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
  return (
    <Rect style={StyleSheet.absoluteFill}>
      {({ width, height }) => {
        const squirclePath = getSvgPath({
          width: width,
          height: height,
          cornerSmoothing,
          cornerRadius,
          topLeftCornerRadius,
          topRightCornerRadius,
          bottomRightCornerRadius,
          bottomLeftCornerRadius,
        })

        if (strokeWidth > 0) {
          // Since SVG doesn't support inner stroke, we double the stroke width
          // and remove the outer half with clipPath
          return (
            <Svg>
              <Defs>
                <ClipPath id="clip">
                  <Path d={squirclePath} />
                </ClipPath>
              </Defs>
              <Path
                clipPath="url(#clip)"
                d={squirclePath}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth * 2}
              />
            </Svg>
          )
        } else {
          return (
            <Svg>
              <Path d={squirclePath} fill={fillColor} />
            </Svg>
          )
        }
      }}
    </Rect>
  )
}

// Inspired by https://reach.tech/rect/
interface RectProps extends ViewProps {
  children: (rect: { width: number; height: number }) => ReactNode
}

function Rect({ children, ...rest }: RectProps) {
  const [rect, setRect] =
    useState<{ width: number; height: number } | null>(null)

  return (
    <View
      {...rest}
      onLayout={(e) => {
        setRect({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })
      }}
    >
      {rect ? children(rect) : null}
    </View>
  )
}

export { SquircleView }
export type { SquircleParams, SquircleViewProps }
