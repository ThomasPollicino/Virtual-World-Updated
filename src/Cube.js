class Cube {//I had a big bug and Claude AI helped me fix it, this.vertices and this.uv was from AI
    constructor() {
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.vertices = [
        0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0,
        1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0
      ];
      this.uv = [
        //Front
        0, 0, 1, 1, 1, 0,
        0, 0, 0, 1, 1, 1,
        //Bottom
        0, 0, 1, 1, 0, 1,
        1, 0, 0, 0, 1, 1,
        //Left Side
        1, 0, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 1,
        //Top
        1, 0, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 1,
        //Right Side
        1, 0, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 1,
        //Back
        1, 0, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 1,
      ];
      this.textureNum = -2;

    }
  
    render() {
      var rgba = this.color;
      gl.uniform1i(u_whichTexture,this.textureNum);

      

      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      // Create and bind the vertex buffer
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
  
      // Create and bind the UV buffer
      var uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);
      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_UV);
      // Draw the triangles
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
  }