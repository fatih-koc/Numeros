// Shader 1: Flowing Waves - Extracting Life Path
export const flowingWavesShader = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

  for(float i = 1.0; i < 10.0; i++){
    uv.x += 0.6 / i * cos(i * 2.5 * uv.y + iTime);
    uv.y += 0.6 / i * cos(i * 1.5 * uv.x + iTime);
  }

  // Purple/violet mystical energy colors
  vec3 col = vec3(0.3, 0.1, 0.5) / abs(sin(iTime - uv.y - uv.x));

  // Circular mask
  vec2 center = iResolution * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;
  float edge = smoothstep(radius, radius - 4.0, dist);

  // Center dimming
  float centerDim = smoothstep(radius * 0.0, radius * 0.4, dist);
  col = mix(col * 0.2, col, centerDim);

  gl_FragColor = vec4(col * edge, edge);
}
`

// Shader 2: Ether by nimitz - the main effect for the Love Engine
export const etherShader = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

#define t iTime
mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}
float map(vec3 p){
    p.xz*= m(t*0.4);p.xy*= m(t*0.3);
    vec3 q = p*2.+t;
    return length(p+vec3(sin(t*0.7)))*log(length(p)+1.) + sin(q.x+sin(q.z+sin(q.y)))*0.5 - 1.;
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 p = fragCoord.xy/min(iResolution.x, iResolution.y) - vec2(.9, .5);
    p.x += 0.4;

    vec3 cl = vec3(0.);
    float d = 2.5;

    for(int i=0; i<=5; i++) {
        vec3 p3d = vec3(0,0,5.) + normalize(vec3(p, -1.))*d;
        float rz = map(p3d);
        float f = clamp((rz - map(p3d+.1))*0.5, -.1, 1.);

        // Purple-pink mystical palette for numEros
        vec3 baseColor = vec3(0.2, 0.1, 0.3) + vec3(4.0, 1.5, 5.0)*f;

        cl = cl*baseColor + smoothstep(2.5, .0, rz)*.7*baseColor;
        d += min(rz, 1.);
    }

    // Calculate distance from center for circular mask
    vec2 center = iResolution * 0.5;
    float dist = distance(fragCoord, center);
    float radius = min(iResolution.x, iResolution.y) * 0.5;

    // Smooth edge falloff
    float edge = smoothstep(radius, radius - 4.0, dist);

    // Center dimming for inner glow effect
    float centerDim = smoothstep(radius * 0.0, radius * 0.4, dist);
    cl = mix(cl * 0.2, cl, centerDim);

    gl_FragColor = vec4(cl * edge, edge);
}
`

// Shader 3: Shooting Stars - Mapping Bond Pattern
export const shootingStarsShader = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec4 O = vec4(0.0, 0.0, 0.0, 1.0);
  vec2 b = vec2(0.0, 0.2);
  vec2 p;
  mat2 R = mat2(1.0, 0.0, 0.0, 1.0);

  vec2 center = iResolution.xy * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;
  float centerDim = smoothstep(radius * 0.3, radius * 0.5, dist);

  for(int i = 0; i < 20; i++) {
    float fi = float(i) + 1.0;
    float angle = fi + 0.0;
    float c = cos(angle);
    float s = sin(angle);
    R = mat2(c, -s, s, c);

    float angle2 = fi + 33.0;
    float c2 = cos(angle2);
    float s2 = sin(angle2);
    mat2 R2 = mat2(c2, -s2, s2, c2);

    vec2 coord = fragCoord / iResolution.y * fi * 0.1 + iTime * b;
    vec2 frac_coord = fract(coord * R2) - 0.5;
    p = R * frac_coord;
    vec2 clamped_p = clamp(p, -b, b);

    float len = length(clamped_p - p);
    if (len > 0.0) {
      vec4 star = 1e-3 / len * (cos(p.y / 0.1 + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0);
      O += star;
    }
  }

  // Purple-pink tint for numEros
  O.rgb = mix(O.rgb, vec3(0.5, 0.2, 0.7), 0.2);
  O.rgb = mix(O.rgb * 0.3, O.rgb, centerDim);

  // Apply circular mask
  float edge = smoothstep(radius, radius - 4.0, dist);
  gl_FragColor = vec4(O.rgb * edge, edge);
}
`

// Shader 4: Wavy Lines - Calculating Friction
export const wavyLinesShader = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i.x + i.y * 57.0);
    float b = hash(i.x + 1.0 + i.y * 57.0);
    float c = hash(i.x + i.y * 57.0 + 1.0);
    float d = hash(i.x + 1.0 + i.y * 57.0 + 1.0);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
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

float lines(vec2 uv, float thickness, float distortion) {
    float y = uv.y;
    float distortionAmount = distortion * fbm(vec2(uv.x * 2.0, y * 0.5 + iTime * 0.1));
    y += distortionAmount;

    float linePattern = fract(y * 20.0);
    float line = smoothstep(0.5 - thickness, 0.5, linePattern) -
                smoothstep(0.5, 0.5 + thickness, linePattern);

    return line;
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord / iResolution.xy;
    float aspect = iResolution.x / iResolution.y;
    uv.x *= aspect;

    float baseThickness = 0.05;
    float baseDistortion = 0.2;

    float line = lines(uv, baseThickness, baseDistortion);
    float timeOffset = sin(iTime * 0.2) * 0.1;
    float animatedLine = lines(uv + vec2(timeOffset, 0.0), baseThickness, baseDistortion);
    line = mix(line, animatedLine, 0.3);

    vec3 backgroundColor = vec3(0.0, 0.0, 0.0);
    vec3 lineColor = vec3(0.5, 0.2, 0.8); // Purple for numEros

    vec3 finalColor = mix(backgroundColor, lineColor, line);

    vec2 center = iResolution.xy * 0.5;
    float dist = distance(fragCoord, center);
    float radius = min(iResolution.x, iResolution.y) * 0.5;
    float centerDim = smoothstep(radius * 0.3, radius * 0.5, dist);

    finalColor = mix(finalColor * 0.3, finalColor, centerDim);

    float edge = smoothstep(radius, radius - 4.0, dist);
    gl_FragColor = vec4(finalColor * edge, edge);
}
`

// Shader 5: Plasma Energy - Assembling Love Blueprint
export const plasmaEnergyShader = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);

    float v = 0.0;
    vec2 c = uv * vec2(3.0, 3.0) - vec2(20.0);

    v += sin((c.x + iTime));
    v += sin((c.y + iTime) / 2.0);
    v += sin((c.x + c.y + iTime) / 2.0);

    c += vec2(sin(iTime / 3.0), cos(iTime / 2.0)) * 2.0;

    v += sin(sqrt(c.x * c.x + c.y * c.y + 1.0) + iTime);
    v = v / 2.0;

    vec3 col = vec3(
        sin(v * 3.14159),
        sin(v * 3.14159 + 2.0 * 3.14159 / 3.0),
        sin(v * 3.14159 + 4.0 * 3.14159 / 3.0)
    ) * 0.5 + 0.5;

    // Purple-pink energy tint
    col = mix(col, vec3(0.6, 0.2, 0.8), 0.4);

    // Circular mask
    vec2 center = iResolution * 0.5;
    float dist = distance(fragCoord, center);
    float radius = min(iResolution.x, iResolution.y) * 0.5;
    float edge = smoothstep(radius, radius - 4.0, dist);

    // Center dimming
    float centerDim = smoothstep(radius * 0.0, radius * 0.4, dist);
    col = mix(col * 0.2, col, centerDim);

    gl_FragColor = vec4(col * edge, edge);
}
`

// Shader collection with metadata
export const shaders = [
  {
    id: 1,
    name: 'Flowing Waves',
    fragmentShader: flowingWavesShader,
    description: 'Extracting Life Path',
  },
  {
    id: 2,
    name: 'Ether',
    fragmentShader: etherShader,
    description: 'Decoding Desire',
  },
  {
    id: 3,
    name: 'Shooting Stars',
    fragmentShader: shootingStarsShader,
    description: 'Mapping Bond Pattern',
  },
  {
    id: 4,
    name: 'Wavy Lines',
    fragmentShader: wavyLinesShader,
    description: 'Calculating Friction',
  },
  {
    id: 5,
    name: 'Plasma Energy',
    fragmentShader: plasmaEnergyShader,
    description: 'Assembling Love Blueprint',
  },
]

// Quick access map
export const shaderMap: Record<number, string> = {
  1: flowingWavesShader,
  2: etherShader,
  3: shootingStarsShader,
  4: wavyLinesShader,
  5: plasmaEnergyShader,
}
