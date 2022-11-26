uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uMultiplier;

varying float vElevation;

void main()
{
    float mixStrength = vElevation * uMultiplier + uColorOffset;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    gl_FragColor = vec4(color, 1.0);
}