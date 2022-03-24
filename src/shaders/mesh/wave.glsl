
uniform vec2 uResolution;

uniform float uTime; 
uniform float uLight;
uniform float uZoom;

uniform bool uPink;

//color var
uniform float uColorRed;
//Chaos
uniform float uChaos;
uniform float uDeform;
uniform bool uSpectral;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;


void main() {
	vec2 uv = (gl_FragCoord.xy - uResolution * .5) / uResolution.yy + 0.5;
    
	
	float t = uTime;
	float n = 0.005;
	float cAnim = sin(uTime); // Same anim as particles 	
	
	vec3 c1 = vec3(0.0);
	vec3 c2 = vec3(0.29 + cAnim, 0.50 - cAnim, 0.68 + cAnim);
	float wave = fract(sin(uv.x * n + t) + uv.y * n + sin(t * 5.));
	
	vec3 color = vec3(wave, vUv);
	color *= mix(c1, c2, vec3(wave));
	
    gl_FragColor = vec4(color, 1.0);
}