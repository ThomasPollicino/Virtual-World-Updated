class Pyramid{
    constructor(){
      this.type = 'pyramid';
      this.color = [1.0,1.0,1.0,1.0];
      this.matrix = new Matrix4();
    }
  
    render(){
    var rgba = this.color;
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
    gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
    drawTriangle3d( [ 1.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 1.0 ] ); 
    drawTriangle3d( [ 0.0, 0.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, 1.0 ] ); 
    
    gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
    drawTriangle3d( [ 0.0, 0.0, 0.0,  0.5, 0.5, 0.5,  1.0, 0.0, 0.0 ] );
    
    gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
    drawTriangle3d( [ 1.0, 0.0, 1.0,  0.5, 0.5, 0.5,  1.0, 0.0, 0.0 ] );
    
    gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
    drawTriangle3d( [ 1.0, 0.0, 1.0,  0.5, 0.5, 0.5,  0.0, 0.0, 1.0 ] );
    
    gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
    drawTriangle3d( [ 0.0, 0.0, 1.0,  0.5, 0.5, 0.5,  0.0, 0.0, 0.0 ] );

    }
  }