precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;
    
void main()
{
    vec4 textureColor = texture2D(uTexture,vUv);
    textureColor.rgb += vElevation * 1.5;
    gl_FragColor = textureColor;
}