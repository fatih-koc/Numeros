import React, {useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import {
  Canvas,
  Skia,
  Shader,
  Fill,
  Group,
} from '@shopify/react-native-skia'
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  Easing,
  SharedValue,
} from 'react-native-reanimated'

interface ShaderCanvasProps {
  size: number
  shaderId?: SharedValue<number> | number
  isCalculating?: boolean
}

// Skia GLSL shaders - adapted for Skia's shader language
const flowingWavesSource = Skia.RuntimeEffect.Make(`
uniform float2 iResolution;
uniform float iTime;

half4 main(float2 fragCoord) {
  float2 uv = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

  for(float i = 1.0; i < 10.0; i++){
    uv.x += 0.6 / i * cos(i * 2.5 * uv.y + iTime);
    uv.y += 0.6 / i * cos(i * 1.5 * uv.x + iTime);
  }

  // Purple/violet mystical energy colors
  float3 col = float3(0.3, 0.1, 0.5) / abs(sin(iTime - uv.y - uv.x));
  col = clamp(col, float3(0.0), float3(1.0));

  // Circular mask
  float2 center = iResolution * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;
  float edge = smoothstep(radius, radius - 8.0, dist);

  // Center dimming
  float centerDim = smoothstep(radius * 0.0, radius * 0.4, dist);
  col = mix(col * 0.2, col, centerDim);

  return half4(col * edge, edge);
}
`)!

const etherSource = Skia.RuntimeEffect.Make(`
uniform float2 iResolution;
uniform float iTime;

float2x2 m(float a) {
  float c = cos(a);
  float s = sin(a);
  return float2x2(c, -s, s, c);
}

float map(float3 p, float t) {
  p.xz = m(t * 0.4) * p.xz;
  p.xy = m(t * 0.3) * p.xy;
  float3 q = p * 2.0 + t;
  return length(p + float3(sin(t * 0.7))) * log(length(p) + 1.0) + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
}

half4 main(float2 fragCoord) {
  float t = iTime;
  float2 p = fragCoord.xy / min(iResolution.x, iResolution.y) - float2(0.9, 0.5);
  p.x += 0.4;

  float3 cl = float3(0.0);
  float d = 2.5;

  for(int i = 0; i <= 5; i++) {
    float3 p3d = float3(0.0, 0.0, 5.0) + normalize(float3(p, -1.0)) * d;
    float rz = map(p3d, t);
    float f = clamp((rz - map(p3d + 0.1, t)) * 0.5, -0.1, 1.0);

    // Purple-pink mystical palette
    float3 baseColor = float3(0.2, 0.1, 0.3) + float3(4.0, 1.5, 5.0) * f;
    cl = cl * baseColor + smoothstep(2.5, 0.0, rz) * 0.7 * baseColor;
    d += min(rz, 1.0);
  }

  cl = clamp(cl, float3(0.0), float3(1.0));

  // Circular mask
  float2 center = iResolution * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;
  float edge = smoothstep(radius, radius - 8.0, dist);

  // Center dimming
  float centerDim = smoothstep(radius * 0.0, radius * 0.4, dist);
  cl = mix(cl * 0.2, cl, centerDim);

  return half4(cl * edge, edge);
}
`)!

const shootingStarsSource = Skia.RuntimeEffect.Make(`
uniform float2 iResolution;
uniform float iTime;

half4 main(float2 fragCoord) {
  float4 O = float4(0.0, 0.0, 0.0, 1.0);
  float2 b = float2(0.0, 0.2);

  float2 center = iResolution.xy * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;
  float centerDim = smoothstep(radius * 0.3, radius * 0.5, dist);

  for(int i = 0; i < 20; i++) {
    float fi = float(i) + 1.0;
    float angle = fi;
    float c = cos(angle);
    float s = sin(angle);
    float2x2 R = float2x2(c, -s, s, c);

    float angle2 = fi + 33.0;
    float c2 = cos(angle2);
    float s2 = sin(angle2);
    float2x2 R2 = float2x2(c2, -s2, s2, c2);

    float2 coord = fragCoord / iResolution.y * fi * 0.1 + iTime * b;
    float2 frac_coord = fract(R2 * coord) - 0.5;
    float2 p = R * frac_coord;
    float2 clamped_p = clamp(p, -b, b);

    float len = length(clamped_p - p);
    if (len > 0.0) {
      float4 star = 1e-3 / len * (cos(p.y / 0.1 + float4(0.0, 1.0, 2.0, 3.0)) + 1.0);
      O += star;
    }
  }

  O.rgb = clamp(O.rgb, float3(0.0), float3(1.0));
  O.rgb = mix(O.rgb, float3(0.5, 0.2, 0.7), 0.2);
  O.rgb = mix(O.rgb * 0.3, O.rgb, centerDim);

  float edge = smoothstep(radius, radius - 8.0, dist);
  return half4(O.rgb * edge, edge);
}
`)!

const wavyLinesSource = Skia.RuntimeEffect.Make(`
uniform float2 iResolution;
uniform float iTime;

float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

float noise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i.x + i.y * 57.0);
  float b = hash(i.x + 1.0 + i.y * 57.0);
  float c = hash(i.x + (i.y + 1.0) * 57.0);
  float d = hash(i.x + 1.0 + (i.y + 1.0) * 57.0);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(float2 p) {
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for(int i = 0; i < 6; i++) {
    sum += amp * noise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return sum;
}

float lines(float2 uv, float thickness, float distortion, float time) {
  float y = uv.y;
  float distortionAmount = distortion * fbm(float2(uv.x * 2.0, y * 0.5 + time * 0.1));
  y += distortionAmount;

  float linePattern = fract(y * 20.0);
  float line = smoothstep(0.5 - thickness, 0.5, linePattern) -
              smoothstep(0.5, 0.5 + thickness, linePattern);

  return line;
}

half4 main(float2 fragCoord) {
  float2 uv = fragCoord / iResolution.xy;
  float aspect = iResolution.x / iResolution.y;
  uv.x *= aspect;

  float baseThickness = 0.05;
  float baseDistortion = 0.2;

  float line = lines(uv, baseThickness, baseDistortion, iTime);
  float timeOffset = sin(iTime * 0.2) * 0.1;
  float animatedLine = lines(uv + float2(timeOffset, 0.0), baseThickness, baseDistortion, iTime);
  line = mix(line, animatedLine, 0.3);

  float3 backgroundColor = float3(0.0);
  float3 lineColor = float3(0.5, 0.2, 0.8);

  float3 finalColor = mix(backgroundColor, lineColor, line);

  float2 center = iResolution.xy * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;
  float centerDim = smoothstep(radius * 0.3, radius * 0.5, dist);

  finalColor = mix(finalColor * 0.3, finalColor, centerDim);

  float edge = smoothstep(radius, radius - 8.0, dist);
  return half4(finalColor * edge, edge);
}
`)!

const plasmaEnergySource = Skia.RuntimeEffect.Make(`
uniform float2 iResolution;
uniform float iTime;

half4 main(float2 fragCoord) {
  float2 uv = (fragCoord * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);

  float v = 0.0;
  float2 c = uv * float2(3.0, 3.0) - float2(20.0);

  v += sin((c.x + iTime));
  v += sin((c.y + iTime) / 2.0);
  v += sin((c.x + c.y + iTime) / 2.0);

  c += float2(sin(iTime / 3.0), cos(iTime / 2.0)) * 2.0;

  v += sin(sqrt(c.x * c.x + c.y * c.y + 1.0) + iTime);
  v = v / 2.0;

  float3 col = float3(
    sin(v * 3.14159),
    sin(v * 3.14159 + 2.0 * 3.14159 / 3.0),
    sin(v * 3.14159 + 4.0 * 3.14159 / 3.0)
  ) * 0.5 + 0.5;

  // Purple-pink energy tint
  col = mix(col, float3(0.6, 0.2, 0.8), 0.4);

  // Circular mask
  float2 center = iResolution * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;
  float edge = smoothstep(radius, radius - 8.0, dist);

  // Center dimming
  float centerDim = smoothstep(radius * 0.0, radius * 0.4, dist);
  col = mix(col * 0.2, col, centerDim);

  return half4(col * edge, edge);
}
`)!

export function ShaderCanvas({
  size,
  shaderId: shaderIdProp,
  isCalculating = false,
}: ShaderCanvasProps) {
  const time = useSharedValue(0)

  // Normalize shaderId to always be a SharedValue
  const internalShaderId = useSharedValue(2)

  // If shaderId is a number, update internal value
  useEffect(() => {
    if (typeof shaderIdProp === 'number') {
      internalShaderId.value = shaderIdProp
    }
  }, [shaderIdProp, internalShaderId])

  // Animate time continuously
  useEffect(() => {
    time.value = 0
    time.value = withRepeat(
      withTiming(1000, {duration: 1000000, easing: Easing.linear}),
      -1,
      false,
    )
  }, [time])

  // Get shader ID value (from prop SharedValue or internal)
  const currentShaderId = useDerivedValue(() => {
    if (shaderIdProp && typeof shaderIdProp === 'object' && 'value' in shaderIdProp) {
      return shaderIdProp.value
    }
    return internalShaderId.value
  }, [shaderIdProp])

  // Create uniforms for the shader - includes shader selection
  const uniforms = useDerivedValue(() => {
    return {
      iResolution: [size, size],
      iTime: time.value,
    }
  }, [size, time])

  // For now, we need to render all shaders and control visibility
  // because Skia doesn't support dynamic shader switching within useDerivedValue
  // The shader selection happens based on the currentShaderId
  const shaderOpacity1 = useDerivedValue(() => currentShaderId.value === 1 ? 1 : 0)
  const shaderOpacity2 = useDerivedValue(() => currentShaderId.value === 2 || currentShaderId.value < 1 ? 1 : 0)
  const shaderOpacity3 = useDerivedValue(() => currentShaderId.value === 3 ? 1 : 0)
  const shaderOpacity4 = useDerivedValue(() => currentShaderId.value === 4 ? 1 : 0)
  const shaderOpacity5 = useDerivedValue(() => currentShaderId.value >= 5 ? 1 : 0)

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <Canvas style={{width: size, height: size}}>
        <Group clip={{x: 0, y: 0, width: size, height: size}}>
          {/* Shader 1: Flowing Waves */}
          <Group opacity={shaderOpacity1}>
            <Fill>
              <Shader source={flowingWavesSource} uniforms={uniforms} />
            </Fill>
          </Group>
          {/* Shader 2: Ether (default) */}
          <Group opacity={shaderOpacity2}>
            <Fill>
              <Shader source={etherSource} uniforms={uniforms} />
            </Fill>
          </Group>
          {/* Shader 3: Shooting Stars */}
          <Group opacity={shaderOpacity3}>
            <Fill>
              <Shader source={shootingStarsSource} uniforms={uniforms} />
            </Fill>
          </Group>
          {/* Shader 4: Wavy Lines */}
          <Group opacity={shaderOpacity4}>
            <Fill>
              <Shader source={wavyLinesSource} uniforms={uniforms} />
            </Fill>
          </Group>
          {/* Shader 5: Plasma Energy */}
          <Group opacity={shaderOpacity5}>
            <Fill>
              <Shader source={plasmaEnergySource} uniforms={uniforms} />
            </Fill>
          </Group>
        </Group>
      </Canvas>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 1000,
    overflow: 'hidden',
  },
})
