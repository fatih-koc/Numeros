import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GLView } from 'expo-gl';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// HSLA color points for gradient (5 points: center + 4 corners)
const GRADIENT_COLORS = {
  center: { h: 270, s: 0.6, l: 0.35, a: 1.0 },  // Deep violet
  topLeft: { h: 280, s: 0.5, l: 0.25, a: 1.0 },    // Purple-blue
  topRight: { h: 320, s: 0.5, l: 0.3, a: 1.0 },   // Purple-pink
  bottomLeft: { h: 260, s: 0.4, l: 0.2, a: 1.0 }, // Deep blue-violet
  bottomRight: { h: 340, s: 0.4, l: 0.25, a: 1.0 }, // Rose-violet
};

// Panel configuration
const PANEL_INSET = 20; // pixels from screen edge
const CORNER_RADIUS = 32; // rounded corners

// Animation speeds (ms)
const HUE_DRIFT_DURATION = 20000; // 20 seconds for hue cycle
const BREATHING_DURATION = 3000;  // 3 seconds for orb breathing

// ============================================================================
// GLSL SHADERS
// ============================================================================

/**
 * Vertex Shader
 * Minimal fullscreen quad - passes through position and UV coordinates
 */
const VERTEX_SHADER = `
  precision highp float;
  
  attribute vec2 position;
  varying vec2 vUV;
  
  void main() {
    vUV = position * 0.5 + 0.5; // Convert from [-1,1] to [0,1]
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/**
 * Fragment Shader
 * Multi-point gradient with HSLA support and rounded rectangle mask
 */
const FRAGMENT_SHADER = `
  precision highp float;
  
  varying vec2 vUV;
  
  // Uniforms for screen dimensions
  uniform vec2 uResolution;
  uniform vec2 uPanelSize;
  uniform float uCornerRadius;
  
  // Gradient color points (HSLA format)
  uniform vec4 uColorCenter;    // center
  uniform vec4 uColorTL;        // top-left
  uniform vec4 uColorTR;        // top-right
  uniform vec4 uColorBL;        // bottom-left
  uniform vec4 uColorBR;        // bottom-right
  
  // Animation uniforms
  uniform float uTime;
  uniform float uHueDrift;
  
  /**
   * Convert HSL to RGB
   * h: [0, 360], s: [0, 1], l: [0, 1]
   * Returns: RGB [0, 1]
   */
  vec3 hslToRgb(float h, float s, float l) {
    h = mod(h, 360.0) / 360.0; // Normalize to [0, 1]
    
    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
    float m = l - c * 0.5;
    
    vec3 rgb;
    if (h < 1.0/6.0) {
      rgb = vec3(c, x, 0.0);
    } else if (h < 2.0/6.0) {
      rgb = vec3(x, c, 0.0);
    } else if (h < 3.0/6.0) {
      rgb = vec3(0.0, c, x);
    } else if (h < 4.0/6.0) {
      rgb = vec3(0.0, x, c);
    } else if (h < 5.0/6.0) {
      rgb = vec3(x, 0.0, c);
    } else {
      rgb = vec3(c, 0.0, x);
    }
    
    return rgb + m;
  }
  
  /**
   * Rounded rectangle SDF (Signed Distance Field)
   * Returns distance from edge (negative = inside, positive = outside)
   */
  float roundedRectSDF(vec2 center, vec2 size, float radius) {
    vec2 d = abs(center) - size + vec2(radius);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
  }
  
  /**
   * Smooth interpolation between multiple color points
   */
  vec4 multiPointGradient(vec2 uv) {
    // Calculate distances to each corner and center
    float distCenter = length(uv - vec2(0.5, 0.5));
    float distTL = length(uv - vec2(0.0, 0.0));
    float distTR = length(uv - vec2(1.0, 0.0));
    float distBL = length(uv - vec2(0.0, 1.0));
    float distBR = length(uv - vec2(1.0, 1.0));
    
    // Inverse distance weighting
    float totalDist = distCenter + distTL + distTR + distBL + distBR + 0.001;
    float wCenter = (1.0 / (distCenter + 0.001)) / totalDist;
    float wTL = (1.0 / (distTL + 0.001)) / totalDist;
    float wTR = (1.0 / (distTR + 0.001)) / totalDist;
    float wBL = (1.0 / (distBL + 0.001)) / totalDist;
    float wBR = (1.0 / (distBR + 0.001)) / totalDist;
    
    // Apply hue drift to all colors
    vec4 center = uColorCenter + vec4(uHueDrift, 0.0, 0.0, 0.0);
    vec4 tl = uColorTL + vec4(uHueDrift * 0.8, 0.0, 0.0, 0.0);
    vec4 tr = uColorTR + vec4(uHueDrift * 0.9, 0.0, 0.0, 0.0);
    vec4 bl = uColorBL + vec4(uHueDrift * 0.7, 0.0, 0.0, 0.0);
    vec4 br = uColorBR + vec4(uHueDrift * 0.85, 0.0, 0.0, 0.0);
    
    // Blend HSLA values
    vec4 hsla = center * wCenter + tl * wTL + tr * wTR + bl * wBL + br * wBR;
    
    return hsla;
  }
  
  void main() {
    // Convert UV to pixel coordinates
    vec2 pixelCoord = vUV * uResolution;
    
    // Calculate panel rectangle center (accounting for screen size and inset)
    vec2 panelCenter = uResolution * 0.5;
    vec2 halfPanelSize = uPanelSize * 0.5;
    
    // Transform to centered coordinates
    vec2 centered = pixelCoord - panelCenter;
    
    // Calculate rounded rectangle mask
    float sdf = roundedRectSDF(centered, halfPanelSize, uCornerRadius);
    float mask = 1.0 - smoothstep(-1.0, 1.0, sdf);
    
    // Get blended HSLA color
    vec4 hsla = multiPointGradient(vUV);
    
    // Convert HSLA to RGBA
    vec3 rgb = hslToRgb(hsla.x, hsla.y, hsla.z);
    
    // Apply mask to alpha
    float alpha = hsla.w * mask;
    
    // Output final color
    gl_FragColor = vec4(rgb, alpha);
  }
`;

// ============================================================================
// WEBGL BACKGROUND PANEL COMPONENT
// ============================================================================

interface BackgroundPanelProps {
  hueDrift: SharedValue<number>;
}

const BackgroundPanel: React.FC<BackgroundPanelProps> = ({ hueDrift }) => {
  const glRef = useRef<any>(null);
  const programRef = useRef<any>(null);
  const uniformsRef = useRef<any>({});
  const animationFrameRef = useRef<number | undefined>(undefined);

  const onContextCreate = (gl: any) => {
    glRef.current = gl;

    // Setup WebGL context
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Clear to transparent
    gl.clearColor(0, 0, 0, 0);

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error('Failed to create program');
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Create fullscreen quad
    const vertices = new Float32Array([
      -1, -1,  // bottom-left
      1, -1,  // bottom-right
      -1, 1,  // top-left
      1, 1,  // top-right
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    uniformsRef.current = {
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uPanelSize: gl.getUniformLocation(program, 'uPanelSize'),
      uCornerRadius: gl.getUniformLocation(program, 'uCornerRadius'),
      uColorCenter: gl.getUniformLocation(program, 'uColorCenter'),
      uColorTL: gl.getUniformLocation(program, 'uColorTL'),
      uColorTR: gl.getUniformLocation(program, 'uColorTR'),
      uColorBL: gl.getUniformLocation(program, 'uColorBL'),
      uColorBR: gl.getUniformLocation(program, 'uColorBR'),
      uTime: gl.getUniformLocation(program, 'uTime'),
      uHueDrift: gl.getUniformLocation(program, 'uHueDrift'),
    };

    // Set static uniforms
    gl.uniform2f(uniformsRef.current.uResolution, gl.drawingBufferWidth, gl.drawingBufferHeight);

    const panelWidth = gl.drawingBufferWidth - (PANEL_INSET * 2);
    const panelHeight = gl.drawingBufferHeight - (PANEL_INSET * 2);
    gl.uniform2f(uniformsRef.current.uPanelSize, panelWidth, panelHeight);
    gl.uniform1f(uniformsRef.current.uCornerRadius, CORNER_RADIUS);

    // Set gradient colors (HSLA format)
    setColorUniform(gl, uniformsRef.current.uColorCenter, GRADIENT_COLORS.center);
    setColorUniform(gl, uniformsRef.current.uColorTL, GRADIENT_COLORS.topLeft);
    setColorUniform(gl, uniformsRef.current.uColorTR, GRADIENT_COLORS.topRight);
    setColorUniform(gl, uniformsRef.current.uColorBL, GRADIENT_COLORS.bottomLeft);
    setColorUniform(gl, uniformsRef.current.uColorBR, GRADIENT_COLORS.bottomRight);

    // Start render loop
    let startTime = Date.now();
    const render = () => {
      if (!gl || !programRef.current) return;

      const currentTime = (Date.now() - startTime) / 1000;

      gl.clear(gl.COLOR_BUFFER_BIT);

      // Update time-based uniforms
      gl.uniform1f(uniformsRef.current.uTime, currentTime);
      gl.uniform1f(uniformsRef.current.uHueDrift, hueDrift.value);

      // Draw fullscreen quad
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.endFrameEXP();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <GLView
      style={styles.backgroundPanel}
      onContextCreate={onContextCreate}
    />
  );
};

// ============================================================================
// WEBGL HELPER FUNCTIONS
// ============================================================================

function createShader(gl: any, type: number, source: string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: any, vertexShader: any, fragmentShader: any) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function setColorUniform(gl: any, location: any, color: { h: number; s: number; l: number; a: number }) {
  gl.uniform4f(location, color.h, color.s, color.l, color.a);
}

// ============================================================================
// STATUS ORB COMPONENT
// ============================================================================

interface StatusOrbProps {
  breathing: SharedValue<number>;
  statusText: string;
}

const StatusOrb: React.FC<StatusOrbProps> = ({ breathing, statusText }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathing.value }],
    opacity: 0.8 + (breathing.value - 1) * 0.4,
  }));

  return (
    <View style={styles.orbContainer}>
      <Animated.View style={[styles.orb, animatedStyle]}>
        <View style={styles.orbInner} />
      </Animated.View>
      <Text style={styles.statusText}>{statusText}</Text>
      <Text style={styles.subText}>Your love field is unaligned</Text>
    </View>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App(): React.JSX.Element {
  // Animation shared values
  const hueDrift = useSharedValue(0);
  const breathing = useSharedValue(1);

  useEffect(() => {
    // Hue drift animation - slow, continuous cycle
    hueDrift.value = withRepeat(
      withTiming(30, {
        duration: HUE_DRIFT_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Breathing animation - gentle pulse
    breathing.value = withRepeat(
      withSequence(
        withTiming(1.08, {
          duration: BREATHING_DURATION / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: BREATHING_DURATION / 2,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* Background Panel - WebGL rendered */}
        <BackgroundPanel hueDrift={hueDrift} />

        {/* Foreground Content */}
        <View style={styles.content}>
          <Text style={styles.logo}>
            num<Text style={styles.logoAccent}>Eros</Text>
          </Text>

          <StatusOrb breathing={breathing} statusText="numEros is idle" />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0815', // Deep background that shows through transparency
  },
  backgroundPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    position: 'absolute',
    top: 60,
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 8,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  logoAccent: {
    color: '#8B5CF6',
  },
  orbContainer: {
    alignItems: 'center',
    gap: 24,
  },
  orb: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 20,
  },
  orbInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
  },
  subText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    fontStyle: 'italic',
  },
});

export default App;