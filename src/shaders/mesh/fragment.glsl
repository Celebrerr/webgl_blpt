

uniform float uTime; 
uniform float uLight;
uniform sampler2D uTexture;
uniform vec2 uResolution;
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


// Custom math
mat2 m(float a){
    float c = cos(a), s = sin(a);
    return mat2(c , -s, s, c);
}

float map(vec3 p){
    // Position controls
    p.xz*= m(uTime * 2.2);
    p.xy*= m(uTime * 1.2);
    // Deforming controls - range(0.0 - 6.0 [after that only chaos])
    float deform = uDeform;
    float chaos = uChaos;

    vec3 q = p * deform + uTime;
    vec3 q2 = p * 30.0 + uTime;
    float zoom = uZoom;

   

    return length( cos(q2 * 0.5) + vec3 (sin(uTime * 5.2))) * log(length(q2) * 0.01) + sin(p.z + cos(p.y + cos(p.z))) * uChaos * uDeform;
}


void main(){	
    vec2 position;
	position = gl_FragCoord.xy / 1920.0 - uResolution;
    
    vec3 cl = vec3(.5);
    // Aurora boreale effect
    float aurora = 0.5;

    for(int i = 0; i <= 5; i++)	{
        // Control values on position 
        vec3 position = vec3(0, 0., 8.) + normalize(vec3(position, - uZoom)) * aurora;

        float red = uColorRed;
        float blue = uColorRed;
        float rAmp = sin(red) * 2.5;

        float rz = map(position);
        float minRz =  min(rz, 1.5);


        bool spect = uSpectral;
        float spectral = min(sin(rz) * 4.5, 2.5);

        bool pinkBlossom = uPink;
        if (pinkBlossom) {
            float f =  clamp((rz - map(position * rAmp)) * 0.08, - 1. , 0.3);
            vec3 color = vec3(red, vUv) - vec3(red , vUv) * f;
                    cl = cl * color + smoothstep(20.5, .0, rAmp) * .8 * color;
                        spect ? aurora -= spectral : aurora += min(rz, 1.5);
        } else {
            float f =  clamp((rz - map(position + uChaos)) * .5, + 2.1, 1. );
            vec3 color = vec3(vUv, 0.5) - vec3(vUv, 0.08) * 0.3;
                cl = cl * color + smoothstep(2.5, .0, rz) * uLight * cl;
                    spect ? aurora -= spectral : aurora += min(rz, 1.5);
        }       
	}
    
    gl_FragColor = vec4(cl, 1.);
}