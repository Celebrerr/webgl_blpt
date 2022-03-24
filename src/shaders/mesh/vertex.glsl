uniform float uTime; 
uniform float uFreq;
uniform float uStrenght;
uniform float uDistortion;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    //----- render full size projection ----
    // gl_Position = vec4(position, 1.0);

    vUv = uv;
    vNormal = normal;
    vPosition = position;
}