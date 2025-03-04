import * as React from 'react'
import { ViewProps, View, StyleSheet, Platform } from 'react-native'
import {
  PropsWithChildren,
  ReactNode,
  useState,
  useRef,
  useLayoutEffect,
} from 'react'
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
interface RectProps extends Omit<ViewProps, 'children'> {
  children: (rect: { width: number; height: number }) => ReactNode
}

function Rect({ children, ...rest }: RectProps) {
  const [rect, setRect] = useState<{ width: number; height: number } | null>(
    null
  )
  const ref = useRef<View>(null)

  useLayoutEffect(() => {
    if (!isSyncLayoutAccessAvailable()) {
      throw new Error("This library requires React Native's new architecture.")
    }

    // TODO: Maybe use `getBoundingClientRect` instead when it's stable https://gist.github.com/lunaleaps/148756563999c83220887757f2e549a3#file-tooltip-uselayouteffect-js-L77
    // From my testing, `measureInWindow` is still faster than `unstable_getBoundingClientRect`
    ref.current?.measureInWindow((_x, _y, width, height) => {
      setRect({ width, height })
    })
  }, [])

  return (
    <View ref={ref} {...rest}>
      {rect ? children(rect) : null}
    </View>
  )
}

function isSyncLayoutAccessAvailable() {
  if (Platform.OS === 'web') {
    return true
  }

  return (globalThis as any).RN$Bridgeless === true
}

export { SquircleView, getSvgPath }
export type { SquircleParams, SquircleViewProps }
