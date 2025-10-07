declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Loader, LoadingManager, Group } from 'three';

  export class GLTF {
    scene: Group;
    animations: any[];
    cameras: any[];
    asset: any;
  }

  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    setDRACOLoader(dracoLoader: any): void;
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  import { Loader } from 'three';
  export class DRACOLoader extends Loader {
    constructor(manager?: any);
    setDecoderPath(path: string): void;
    setDecoderConfig(config: any): void;
  }
}

declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, MOUSE, TOUCH, Vector3 } from 'three';
  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    object: Camera;
    domElement: HTMLElement | undefined;
    enabled: boolean;
    target: Vector3;
    enableDamping: boolean;
    dampingFactor: number;
    minDistance: number;
    maxDistance: number;
    minZoom: number;
    maxZoom: number;
    enableRotate: boolean;
    enableZoom: boolean;
    zoomSpeed: number;
    rotateSpeed: number;
    autoRotate: boolean;
    update(): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/math/MeshSurfaceSampler' {
  import { Mesh, Vector3 } from 'three';
  export class MeshSurfaceSampler {
    constructor(mesh: Mesh);
    build(): this;
    sample(target: Vector3): Vector3;
  }
}

declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { WebGLRenderer, WebGLRenderTarget } from 'three';
  export class EffectComposer {
    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
    addPass(pass: any): void;
    render(): void;
    setSize(width: number, height: number): void;
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Scene, Camera } from 'three';
  export class RenderPass {
    constructor(scene: Scene, camera: Camera);
  }
}

declare module 'three/examples/jsm/postprocessing/ShaderPass' {
  export class ShaderPass {
    constructor(shader: any);
    material: any;
    enabled: boolean;
    renderToScreen: boolean;
  }
}