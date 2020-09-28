import React, {useEffect, useRef} from 'react';

export default function Triangle () {
  const canvasRef = useRef()

  /**
   * 创建着色器
   * @param gl WebGL对象
   * @param type 着色器类型
   * @param source 着色器源数据
   * @returns {WebGLShader}
   */
  const createShader = (gl, type, source) => {
    // 创建着色器对象
    const shader = gl.createShader(type)
    // 向着色器添加GLSL源数据
    gl.shaderSource(shader, source)
    // 编译并生成着色器
    gl.compileShader(shader)
    // 检查是否创建着色器成功
    const isSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (isSuccess) {
      return shader
    }
    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  }

  /**
   * 创建着色器程序
   * @param gl WebGL 对象
   * @param vertexShader 顶点着色器
   * @param fragmentShader 片元着色器
   * @returns {WebGLProgram}
   */
  const createProgram = (gl, vertexShader, fragmentShader) => {
    // 创建着色器程序
    const program = gl.createProgram()
    // 将顶点着色器和片元着色器添加至程序
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    // 将程序链接到WebGL
    gl.linkProgram(program)
    // 检查是否链接程序成功
    const isSuccess = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (isSuccess) {
      return program
    }
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
  }

  /**
   * 初始化画布，设置尺寸，清空画布
   * @param gl WebGL 对象
   */
  const initCanvas = (gl) => {
    if (gl.canvas) {
      const realToCSSPixels = window.devicePixelRatio;
      // 浏览器中画布的显示尺寸
      const { clientWidth, clientHeight, width, height } = gl.canvas
      const displayWidth = clientWidth * realToCSSPixels
      const displayHeight = clientHeight * realToCSSPixels
      // 设置canvas宽高
      if (width !== displayWidth || height !== displayHeight) {
        gl.canvas.width = displayWidth
        gl.canvas.height = displayHeight
      }
      // 设置视域，即将裁减空间（-1至1）映射到画布（像素空间）
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      // 清空画布
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
  }

  /**
   * 绘制
   * @param gl WebGL 对象
   */
  const drawCanvas = (gl) => {
    // 顶点着色器源码
    const vertexShaderSource = `
      attribute vec4 a_position;
      varying vec4 v_color;
    
      void main() {
        gl_Position = a_position;
        // 从裁减空间转换到颜色空间
        // 裁减空间范围 -1.0 到 +1.0
        // 颜色空间范围 0.0 到 1.0
        v_color = a_position * 0.5 + 0.5;
      }
    `
    // 片元着色器源码
    const fragShaderSource = `
      // 片断着色器没有默认精度，所以我们需要设置一个精度
      // mediump是一个不错的默认值，代表“medium precision”（中等精度）
      precision mediump float;
      varying vec4 v_color;
      
      void main() {
        gl_FragColor = v_color;
      }
    `
    // 创建顶点着色器
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    // 创建片元着色器
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource)
    // 创建着色程序
    const program = createProgram(gl, vertexShader, fragmentShader)
    // 定义点三维坐标
    const positions = new Float32Array([
      -0.5, -0.5, 0,
      0.5, -0.5, 0,
      0, 0.5, 0
    ])
    // 从GLSL着色器程序中找到顶点着色器属性值
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    // 创建一个顶点数据缓冲区
    const positionBuffer = gl.createBuffer()
    // 绑定缓冲区数据，指定数据类型
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    // 将点位数据复制到缓冲区内存中
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    // 使用着色器程序
    gl.useProgram(program)
    // 启用顶点着色器对应属性
    gl.enableVertexAttribArray(positionAttributeLocation)
    // 指定从缓冲区读取数据的规律
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  useEffect(() => {
    // 获取WebGL上下文
    const gl = canvasRef.current.getContext('webgl')
    // 初始化画布
    initCanvas(gl)
    // 绘制
    drawCanvas(gl)
  })

  return (
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', background: 'rgba(0, 0, 0, .12)'}} />
  )
}
