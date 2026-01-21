import React from "react"
import { View, StyleSheet } from "react-native"
import {
  Canvas,
  Circle,
  Line,
  Group,
  Text,
  useFont,
} from "@shopify/react-native-skia"

/* =======================
   Chart Constants
======================= */

const SIZE = 340
const R = SIZE / 2
const FONT_SIZE = 10

const degToRad = (deg: number) => ((deg - 180) * Math.PI) / 180
const polar = (deg: number, radius: number) => ({
  x: R + Math.cos(degToRad(deg)) * radius,
  y: R + Math.sin(degToRad(deg)) * radius,
})

/* =======================
   Example EPHEMERIS JSON
   Expandable with planets, nodes, asteroids
======================= */

const CHART = {
  ascendant: 213.42,
  houses: Array.from({ length: 12 }).map((_, i) => ({
    house: i + 1,
    degree: [213.42, 243.42, 273.42, 303.42, 333.42, 3.42, 33.42, 63.42, 93.42, 123.42, 153.42, 183.42][i],
  })),
  planets: {
    Sun: 56.32,
    Moon: 144.11,
    Mercury: 32.11,
    Venus: 81.77,
    Mars: 201.55,
    Jupiter: 110.12,
    Saturn: 198.55,
    Uranus: 250.23,
    Neptune: 280.44,
    Pluto: 305.12,
    Chiron: 175.44,
    Node: 190.12,
    Lilith: 88.22,
  },
}

/* =======================
   Component
======================= */

export default function App() {
  // Load TTF font via useFont
  const font = useFont(require("./assets/fonts/Inter-Regular.ttf"), FONT_SIZE)
  if (!font) return null

  return (
    <View style={styles.container}>
      <Canvas style={{ width: SIZE, height: SIZE }}>
        {/* Outer rings */}
        <Circle cx={R} cy={R} r={R - 4} color="#0b0c10" />
        <Circle cx={R} cy={R} r={R - 28} color="#13141b" />

        {/* Rotate wheel by Ascendant */}
        <Group origin={{ x: R, y: R }} transform={[{ rotate: -degToRad(CHART.ascendant) }]}>

          {/* Zodiac divisions (12 × 30°) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const p = polar(i * 30, R - 6)
            return <Line key={i} p1={{ x: R, y: R }} p2={p} strokeWidth={1} color="#2a2d34" />
          })}

          {/* Houses */}
          {CHART.houses.map((h) => {
            const p = polar(h.degree, R - 6)
            const label = polar(h.degree + 2, R - 44)
            return (
              <Group key={h.house}>
                <Line p1={{ x: R, y: R }} p2={p} strokeWidth={2} color="#3a3f48" />
                <Text x={label.x - 6} y={label.y + 4} text={String(h.house)} font={font} color="#7c8496" />
              </Group>
            )
          })}

          {/* Cardinal axes (Asc/Desc MC/IC) */}
          <Line p1={{ x: R, y: 0 }} p2={{ x: R, y: SIZE }} strokeWidth={2} color="#4b5160" />
          <Line p1={{ x: 0, y: R }} p2={{ x: SIZE, y: R }} strokeWidth={2} color="#4b5160" />

          {/* Planets, nodes, asteroids */}
          {Object.entries(CHART.planets).map(([name, deg]) => {
            const pos = polar(deg, R * 0.65)
            const label = polar(deg, R * 0.75)
            return (
              <Group key={name}>
                <Circle cx={pos.x} cy={pos.y} r={6} color="#f2f3f7" />
                <Text x={label.x - 10} y={label.y + 4} text={name.slice(0, 2)} font={font} color="#cfd2dc" />
              </Group>
            )
          })}

        </Group>
      </Canvas>
    </View>
  )
}

/* =======================
   Styles
======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050509",
    alignItems: "center",
    justifyContent: "center",
  },
})
