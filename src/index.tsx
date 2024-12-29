import * as React from 'react'
import { ViewProps, View, StyleSheet } from 'react-native'
import { PropsWithChildren, ReactNode, useState } from 'react'
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
  return (
    <Rect style={StyleSheet.absoluteFill}>
      {({ width, height }) => {
        const hasStroke = strokeWidth > 0

        if (!hasStroke) {
          const squirclePath = getSvgPath({
            width,
            height,
            cornerSmoothing,
            cornerRadius,
            topLeftCornerRadius,
            topRightCornerRadius,
            bottomRightCornerRadius,
            bottomLeftCornerRadius,
          })

          return (
            <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
              <Path d={squirclePath} fill={fillColor} />
            </Svg>
          )
        } else {
          const cornerRadii = [
            cornerRadius,
            topLeftCornerRadius,
            topRightCornerRadius,
            bottomLeftCornerRadius,
            bottomRightCornerRadius,
          ].filter(
            (cornerRadius) => cornerRadius && cornerRadius > 0
          ) as number[]

          const maxStrokeWidth = Math.min(...cornerRadii)
          strokeWidth = Math.min(strokeWidth, maxStrokeWidth)
          const insetAmount = strokeWidth / 2

          const insetSquirclePath = getSvgPath({
            width: width - strokeWidth,
            height: height - strokeWidth,
            cornerSmoothing,
            cornerRadius: getInnerRadius(cornerRadius, insetAmount),
            topLeftCornerRadius: getInnerRadius(
              topLeftCornerRadius,
              insetAmount
            ),
            topRightCornerRadius: getInnerRadius(
              topRightCornerRadius,
              insetAmount
            ),
            bottomRightCornerRadius: getInnerRadius(
              bottomRightCornerRadius,
              insetAmount
            ),
            bottomLeftCornerRadius: getInnerRadius(
              bottomLeftCornerRadius,
              insetAmount
            ),
          })

          return (
            <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
              <Path
                d={insetSquirclePath}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                translate={insetAmount}
              />
            </Svg>
          )
        }
      }}
    </Rect>
  )
}

function getInnerRadius(radius: number | undefined, insetAmount: number) {
  if (radius) {
    return Math.max(0, radius - insetAmount)
  }

  return radius
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

export { SquircleView, getSvgPath }
export type { SquircleParams, SquircleViewProps }
