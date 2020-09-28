import React, {useEffect, useRef} from 'react';

export default function Point () {
  const canvasRef = useRef()

  const initShader = (gl, vertexShaderSource, fragmentShaderSource) => {
    // 创建顶点着色器对象
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    // 创建片元着色器对象
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    // 引入顶点和片元着色器源码
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    // 编译顶点和片元着色器
    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)
    // 创建程序对象
    const program = gl.createProgram()
    // 附着顶点和片元着色器至程序
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    // 连接至程序
    gl.linkProgram(program)
    // 使用程序
    gl.useProgram(program)
    // 返回附着信息的程序
    return program
  }

  useEffect(() => {
    // 获取WebGL上下文
    const gl = canvasRef.current.getContext('webgl')
    // 顶点着色器源码
    const vertexShaderSource = `
      void main() {
        gl_PointSize = 20.0;
        gl_Position = vec4(0.0,0.0,0.0,1.0);
      }`
    // 片元着色器源码
    const fragmentShaderSource = `
      void main() {
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
      }
    `
    gl.program = initShader(gl, vertexShaderSource, fragmentShaderSource)
    // 绘制
    gl.drawArrays(gl.POINTS, 0, 1)
  }, [])


  return (
    <div className="App">
      <canvas height={400} width={500} ref={canvasRef} style={{ background: 'rgba(0, 0, 0, .12)' }} />
    </div>
  );
}
