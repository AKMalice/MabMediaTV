import * as THREE from './three.module.min.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

document.addEventListener('DOMContentLoaded', function () {
    let scene, camera, renderer, textMesh;

    // Loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.style.position = 'fixed';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.width = '100%';
    loadingScreen.style.height = '100%';
    loadingScreen.style.background = 'rgba(0, 0, 0, 0.8)';
    loadingScreen.style.display = 'flex';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.zIndex = '10000';
    loadingScreen.innerHTML = '<div style="color: white; font-size: 24px;">Loading...</div>';
    document.body.appendChild(loadingScreen);

    function setCameraPosition() {
        let z;
        if (window.innerWidth >= 1024) {
            z = 19; // Large screens
        } else if (window.innerWidth >= 768) {
            z = 49; // Medium screens
        } else {
            z = 79; // Small screens
        }
        camera.position.set(0, 0, z);
        camera.lookAt(0, 0, 0);
    }


    function init() {
        // Create a new scene
        scene = new THREE.Scene();

        // Set up the renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(renderer.domElement);

        // Set up the camera
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        setCameraPosition(); // Set initial camera position
        scene.add(camera);

        // Add lighting to the scene
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(2, 2, 5);
        scene.add(directionalLight);

        // Load the default helvetiker font and create the text geometry
        const fontLoader = new FontLoader();
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textGeometry = new TextGeometry('Mab Media TV', {
                font: font,
                size: 3,
                height: 0.5,
                curveSegments: 24,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 10
            });

            // Center the geometry
            textGeometry.computeBoundingBox();
            textGeometry.center();

            // Create a custom shader material for the text
            const textMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xffffff) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vNormal;
                    void main() {
                        vUv = uv;
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    varying vec3 vNormal;
                    void main() {
                        float pulse = sin(time * 2.0) * 0.5 + 0.5;
                        vec3 glow = color * pulse * 0.5;
                        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                        vec3 final = mix(color, glow, fresnel);
                        gl_FragColor = vec4(final, 1.0);
                    }
                `
            });

            textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(0, 0, 0);
            scene.add(textMesh);
        });


        const auroraMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 resolution;
                varying vec2 vUv;

                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1;
                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m;
                    m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                    vec3 g;
                    g.x  = a0.x  * x0.x  + h.x  * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                void main() {
                    vec2 st = vUv;
                    float t = time * 0.1;
                    float noise1 = snoise(vec2(st.x * 2.0 + t, st.y * 2.0 - t));
                    float noise2 = snoise(vec2(st.x * 4.0 - t, st.y * 4.0 + t));
                    float combinedNoise = (noise1 + noise2) * 0.5;
                    float gradient = 1.0 - pow(abs(st.y - 0.5) * 2.0, 2.0);
                    float aurora = smoothstep(0.1, 0.9, combinedNoise * gradient);
                    vec3 backgroundColor = vec3(0.1, 0.1, 0.12);
                    vec3 auroraColor1 = vec3(1.0, 0.0, 0.0);
                    vec3 auroraColor2 = vec3(1.0, 0.0, 0.2);
                    vec3 color = mix(backgroundColor, mix(auroraColor1, auroraColor2, noise1), aurora * 0.7);
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });

        // Create the ground plane with the aurora material
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMesh = new THREE.Mesh(groundGeometry, auroraMaterial);
        groundMesh.position.set(0,0,-6);
        groundMesh.name = 'ground';
        scene.add(groundMesh);

        // Handle window resizing
        window.addEventListener('resize', onWindowResize);

        // Add mouse movement tracking
        document.addEventListener('mousemove', onDocumentMouseMove);

        loadingScreen.style.display = 'none';

        // Start the animation loop
        animate();
    }

    let mouseX = 0, mouseY = 0;
    const onDocumentMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        setCameraPosition(); // Adjust camera position on resize
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        // Update text material time uniform
        if (textMesh && textMesh.material.uniforms) {
            textMesh.material.uniforms.time.value += 0.016; // Assuming 60fps
        }

        // Tilt the text towards the cursor
        if (textMesh) {
            const targetRotationX = mouseY * 0.2;
            const targetRotationY = mouseX * 0.2;
            textMesh.rotation.x += (targetRotationX - textMesh.rotation.x) * 0.1;
            textMesh.rotation.y += (targetRotationY - textMesh.rotation.y) * 0.1;
        }

        const ground = scene.getObjectByName('ground');
        if (ground && ground.material.uniforms) {
            ground.material.uniforms.time.value += 0.1;
        }

        renderer.render(scene, camera);
    }

    init();
});
