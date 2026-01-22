// WebGL type declarations for expo-gl
// These provide TypeScript types for WebGL operations in React Native

type GLenum = number
type GLboolean = boolean
type GLbitfield = number
type GLbyte = number
type GLshort = number
type GLint = number
type GLsizei = number
type GLintptr = number
type GLsizeiptr = number
type GLubyte = number
type GLushort = number
type GLuint = number
type GLfloat = number
type GLclampf = number

interface WebGLShader {}
interface WebGLProgram {}
interface WebGLBuffer {}
interface WebGLUniformLocation {}

interface ExpoWebGL {
  // Constants
  readonly VERTEX_SHADER: GLenum
  readonly FRAGMENT_SHADER: GLenum
  readonly COMPILE_STATUS: GLenum
  readonly LINK_STATUS: GLenum
  readonly ARRAY_BUFFER: GLenum
  readonly STATIC_DRAW: GLenum
  readonly FLOAT: GLenum
  readonly BLEND: GLenum
  readonly SRC_ALPHA: GLenum
  readonly ONE_MINUS_SRC_ALPHA: GLenum
  readonly COLOR_BUFFER_BIT: GLenum
  readonly TRIANGLES: GLenum

  // Properties
  readonly drawingBufferWidth: GLsizei
  readonly drawingBufferHeight: GLsizei

  // Shader methods
  createShader(type: GLenum): WebGLShader | null
  shaderSource(shader: WebGLShader, source: string): void
  compileShader(shader: WebGLShader): void
  getShaderParameter(shader: WebGLShader, pname: GLenum): GLboolean | null
  getShaderInfoLog(shader: WebGLShader): string | null
  deleteShader(shader: WebGLShader | null): void

  // Program methods
  createProgram(): WebGLProgram | null
  attachShader(program: WebGLProgram, shader: WebGLShader): void
  linkProgram(program: WebGLProgram): void
  getProgramParameter(program: WebGLProgram, pname: GLenum): GLboolean | null
  getProgramInfoLog(program: WebGLProgram): string | null
  useProgram(program: WebGLProgram | null): void
  deleteProgram(program: WebGLProgram | null): void

  // Buffer methods
  createBuffer(): WebGLBuffer | null
  bindBuffer(target: GLenum, buffer: WebGLBuffer | null): void
  bufferData(target: GLenum, data: Float32Array, usage: GLenum): void

  // Attribute methods
  getAttribLocation(program: WebGLProgram, name: string): GLint
  enableVertexAttribArray(index: GLuint): void
  vertexAttribPointer(
    index: GLuint,
    size: GLint,
    type: GLenum,
    normalized: GLboolean,
    stride: GLsizei,
    offset: GLintptr
  ): void

  // Uniform methods
  getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation | null
  uniform1f(location: WebGLUniformLocation | null, x: GLfloat): void
  uniform2f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat): void

  // Drawing methods
  viewport(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
  clearColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void
  clear(mask: GLbitfield): void
  drawArrays(mode: GLenum, first: GLint, count: GLsizei): void

  // Blending
  enable(cap: GLenum): void
  blendFunc(sfactor: GLenum, dfactor: GLenum): void

  // expo-gl specific
  endFrameEXP(): void
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ExpoWebGLContext extends ExpoWebGL {}
}

export type {ExpoWebGL, ExpoWebGLContext}
