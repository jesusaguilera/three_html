varying float vNoise;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uTime;

void main(void) {

  // vec3 color1 = vec3( 1.0, 0.0, 0.0 );
  // vec3 color2 = vec3( 1.0, 1.0, 1.0 );

  // vNoise range is between -1 and 1 in order to normalize it between 0 and 1 we can use ( 0.5 * (vNoise + 1.0) )
  // vec3 finalColor = mix( color1, color2, 0.5 * ( vNoise + 1.0 ) );

  // vec2 newUv = vUv;
  // newUv = vec2( newUv.x, newUv.y + 0.01 * sin(newUv.x * 10.0 + uTime) );

  // vec4 forestTexture = texture2D( uTexture, newUv );

  // gl_FragColor = vec4( finalColor, 1.0 );
  gl_FragColor = vec4( vUv, 0.0, 1.0 );

  // gl_FragColor = forestTexture;
  // Play with vNoise and its alpha channel
  // gl_FragColor = forestTexture * vec4(vNoise);
  // gl_FragColor = vec4(vNoise);
}
