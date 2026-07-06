import { useEffect, useRef } from "react";
import * as THREE from "three";

export type WorldVariant = "overworld" | "nether";

type Props = {
  variant?: WorldVariant;
  night?: boolean;
  className?: string;
  /** scales the gentle idle camera drift (no cursor tracking) */
  parallax?: number;
};

/* =========================== value noise =========================== */
function hash(x: number, z: number) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}
function valueNoise(x: number, z: number) {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const tl = hash(xi, zi);
  const tr = hash(xi + 1, zi);
  const bl = hash(xi, zi + 1);
  const br = hash(xi + 1, zi + 1);
  const u = smooth(xf);
  const v = smooth(zf);
  const a = tl + (tr - tl) * u;
  const b = bl + (br - bl) * u;
  return a + (b - a) * v;
}

/* ====================== procedural pixel textures ====================== */
function makeTex(draw: (ctx: CanvasRenderingContext2D, s: number) => void, size = 16) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  draw(ctx, size);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}
function speckle(
  ctx: CanvasRenderingContext2D,
  s: number,
  base: string,
  shades: string[]
) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);
  for (let y = 0; y < s; y++)
    for (let x = 0; x < s; x++)
      if (Math.random() < 0.4) px(ctx, x, y, shades[(Math.random() * shades.length) | 0]);
}

type OverTex = ReturnType<typeof buildOverworldTextures>;
type NethTex = ReturnType<typeof buildNetherTextures>;
let OVER: OverTex | null = null;
let NETH: NethTex | null = null;

function buildOverworldTextures() {
  const grassTop = makeTex((c, s) =>
    speckle(c, s, "#5b8731", ["#6ea338", "#4f7a2b", "#79b23f", "#5f8f30"])
  );
  const dirt = makeTex((c, s) =>
    speckle(c, s, "#7a5535", ["#8b6440", "#6b4a2e", "#5c3f27"])
  );
  const grassSide = makeTex((c, s) => {
    speckle(c, s, "#7a5535", ["#8b6440", "#6b4a2e", "#5c3f27"]);
    for (let x = 0; x < s; x++) {
      const h = 3 + ((Math.random() * 3) | 0);
      for (let y = 0; y < h; y++)
        px(c, x, y, ["#5b8731", "#6ea338", "#4f7a2b"][(Math.random() * 3) | 0]);
    }
  });
  const stone = makeTex((c, s) =>
    speckle(c, s, "#7d7d7d", ["#8f8f8f", "#6d6d6d", "#5f5f5f"])
  );
  const sand = makeTex((c, s) =>
    speckle(c, s, "#d9c58b", ["#e5d29a", "#c9b678", "#efe0a8"])
  );
  const bark = makeTex((c, s) => {
    speckle(c, s, "#5a4026", ["#6b4d2e", "#4a331e"]);
    for (let x = 0; x < s; x += 4)
      for (let y = 0; y < s; y++) px(c, x, y, "#3f2c19");
  });
  const logTop = makeTex((c, s) => {
    speckle(c, s, "#7a5a34", ["#8a6a40", "#6a4c2c"]);
    c.strokeStyle = "#5a4026";
    c.lineWidth = 1;
    c.strokeRect(3.5, 3.5, s - 7, s - 7);
    c.strokeRect(6.5, 6.5, s - 13, s - 13);
  });
  const leaves = makeTex((c, s) => {
    speckle(c, s, "#3f7a29", ["#4f9134", "#2f5c1f", "#347026"]);
    for (let i = 0; i < s * 3; i++)
      c.clearRect((Math.random() * s) | 0, (Math.random() * s) | 0, 1, 1);
  });
  const water = makeTex((c, s) => {
    c.fillStyle = "#eaf2ff";
    c.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y++)
      for (let x = 0; x < s; x++) {
        const v = Math.sin((x + y) * 0.9) + Math.sin(x * 0.5);
        px(c, x, y, v > 0.6 ? "#ffffff" : "#c7d8f0");
      }
  });
  const cloud = makeTex((c, s) => {
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < s; i++)
      px(c, (Math.random() * s) | 0, (Math.random() * s) | 0, "#e6ecf5");
  });
  return { grassTop, dirt, grassSide, stone, sand, bark, logTop, leaves, water, cloud };
}

function buildNetherTextures() {
  const rack = makeTex((c, s) =>
    speckle(c, s, "#6e2b2b", ["#7f3333", "#5a2222", "#4a1a1a", "#853a30"])
  );
  const glow = makeTex((c, s) =>
    speckle(c, s, "#d9a63a", ["#ffcf5e", "#c78f28", "#ffe08a"])
  );
  const soul = makeTex((c, s) => speckle(c, s, "#3a2b22", ["#4a382c", "#2a1f18"]));
  return { rack, glow, soul };
}

/* =============== sun glow (bloom halo) + god rays =============== */
function glowSprite(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
  g.addColorStop(0, color);
  g.addColorStop(0.3, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
function rayTexture(color: string) {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.translate(S / 2, S / 2);
  const g = ctx.createRadialGradient(0, 0, 2, 0, 0, S / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.25, "rgba(255,235,180,0.35)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, S / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = color;
  for (let i = 0; i < 44; i++) {
    const ang = (i / 44) * Math.PI * 2 + hash(i, 7) * 0.4;
    const len = 60 + hash(i, 3) * 66;
    ctx.globalAlpha = 0.05 + hash(i, 9) * 0.12;
    ctx.lineWidth = 1 + hash(i, 5) * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  return new THREE.CanvasTexture(c);
}

/* =========================== presets =========================== */
type Preset = {
  fog: number; fogNear: number; fogFar: number;
  hemiSky: number; hemiGround: number; hemiInt: number;
  dir: number; dirInt: number; dirPos: [number, number, number];
  hasWater: boolean; waterTint?: number; clouds: boolean;
  sun?: { color: number; y: number; z: number; size: number; rays: boolean } | null;
};

function getPreset(variant: WorldVariant, night: boolean): Preset {
  if (variant === "nether") {
    return {
      fog: 0x330a10, fogNear: 14, fogFar: 60,
      hemiSky: 0x6a1522, hemiGround: 0x1a0710, hemiInt: 0.8,
      dir: 0xff7a44, dirInt: 0.6, dirPos: [8, 20, 4],
      hasWater: false, clouds: false, sun: null,
    };
  }
  if (night) {
    return {
      fog: 0x0b1020, fogNear: 22, fogFar: 72,
      hemiSky: 0x2a466e, hemiGround: 0x10151f, hemiInt: 0.5,
      dir: 0x9fb8ff, dirInt: 0.55, dirPos: [-8, 18, -20],
      hasWater: true, waterTint: 0x35507e, clouds: true,
      sun: { color: 0xdfe7ff, y: 10, z: -36, size: 7, rays: false },
    };
  }
  return {
    fog: 0xe89a54, fogNear: 24, fogFar: 78,
    hemiSky: 0xffdca6, hemiGround: 0x4a5a2a, hemiInt: 1.0,
    dir: 0xffb45e, dirInt: 1.2, dirPos: [0, 12, -34],
    hasWater: true, waterTint: 0xffb267, clouds: true,
    sun: { color: 0xffe6a0, y: 7, z: -36, size: 10, rays: true },
  };
}

/* =========================== component =========================== */
export default function VoxelWorld({
  variant = "overworld",
  night = false,
  className = "",
  parallax = 1,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const preset = getPreset(variant, night);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    // Background scene: cap DPR lower than the UI to save fill-rate.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(preset.fog, preset.fogNear, preset.fogFar);
    const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 240);

    const hemi = new THREE.HemisphereLight(preset.hemiSky, preset.hemiGround, preset.hemiInt);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(preset.dir, preset.dirInt);
    dir.position.set(...preset.dirPos);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.near = 1;
    dir.shadow.camera.far = 160;
    dir.shadow.camera.left = -55;
    dir.shadow.camera.right = 55;
    dir.shadow.camera.top = 55;
    dir.shadow.camera.bottom = -55;
    dir.shadow.bias = -0.0006;
    dir.shadow.normalBias = 0.6;
    scene.add(dir);
    dir.target.position.set(0, 2, 0);
    scene.add(dir.target);

    /* ---- textures + materials ---- */
    const box = new THREE.BoxGeometry(1, 1, 1);
    const disposables: Array<{ dispose: () => void }> = [box];
    const lam = (map: THREE.Texture, extra?: THREE.MeshLambertMaterialParameters) =>
      new THREE.MeshLambertMaterial({ map, ...extra });

    let matGrass: THREE.Material[] = [];
    let matDirt: THREE.Material | null = null;
    let matStone: THREE.Material | null = null;
    let matSand: THREE.Material | null = null;
    let matLog: THREE.Material[] = [];
    let matLeaves: THREE.Material | null = null;
    let matCloud: THREE.Material | null = null;
    let matRack: THREE.Material | null = null;
    let matGlow: THREE.Material | null = null;
    let waterTex: THREE.Texture | null = null;

    if (variant === "overworld") {
      OVER = OVER ?? buildOverworldTextures();
      const T = OVER;
      const side = lam(T.grassSide);
      const top = lam(T.grassTop);
      const bottom = lam(T.dirt);
      matGrass = [side, side, top, bottom, side, side];
      matDirt = lam(T.dirt);
      matStone = lam(T.stone);
      matSand = lam(T.sand);
      const barkM = lam(T.bark);
      const logTopM = lam(T.logTop);
      matLog = [barkM, barkM, logTopM, logTopM, barkM, barkM];
      matLeaves = lam(T.leaves, { alphaTest: 0.5 });
      matCloud = new THREE.MeshBasicMaterial({ map: T.cloud, transparent: true, opacity: 0.85 });
      waterTex = T.water;
      disposables.push(side, top, bottom, matDirt, matStone, matSand, barkM, logTopM, matLeaves, matCloud);
    } else {
      NETH = NETH ?? buildNetherTextures();
      const T = NETH;
      matRack = lam(T.rack);
      matStone = lam(T.soul);
      matGlow = new THREE.MeshBasicMaterial({ map: T.glow });
      disposables.push(matRack, matStone, matGlow);
    }

    /* ---- terrain: heightmap + column face-culling ---- */
    const GRID_W = 76;
    const GRID_D = 52;
    const WATER = 3;
    const ox = -GRID_W / 2;
    const oz = -GRID_D / 2;

    const heightAt = (x: number, z: number) => {
      const n =
        valueNoise(x * 0.07, z * 0.07) * 7 +
        valueNoise(x * 0.18, z * 0.18) * 2.4 +
        valueNoise(x * 0.5, z * 0.5) * 0.7;
      let h = Math.floor(1 + n);
      if (preset.hasWater) {
        const centerX = GRID_W / 2 + Math.sin(z * 0.14) * 9 + Math.sin(z * 0.045) * 6;
        const dist = Math.abs(x - centerX);
        const bank = 6;
        if (dist < bank) h = Math.floor(h - (1 - dist / bank) * 7);
      }
      return Math.max(0, h);
    };

    // precompute heightmap once
    const H: number[][] = [];
    for (let gx = 0; gx < GRID_W; gx++) {
      H[gx] = [];
      for (let gz = 0; gz < GRID_D; gz++) H[gx][gz] = heightAt(gx, gz);
    }
    const getH = (gx: number, gz: number) =>
      gx < 0 || gz < 0 || gx >= GRID_W || gz >= GRID_D ? Infinity : H[gx][gz];

    type P = [number, number, number];
    const bGrass: P[] = [], bDirt: P[] = [], bStone: P[] = [], bSand: P[] = [];
    const bLog: P[] = [], bLeaves: P[] = [], bRack: P[] = [], bGlow: P[] = [];

    for (let gx = 0; gx < GRID_W; gx++) {
      for (let gz = 0; gz < GRID_D; gz++) {
        const h = H[gx][gz];
        // only fill down to just above the lowest neighbour (exposed cliff faces)
        const mn = Math.min(getH(gx - 1, gz), getH(gx + 1, gz), getH(gx, gz - 1), getH(gx, gz + 1));
        const bottom = mn >= h ? h : Math.max(0, mn + 1);
        const floor = Math.max(bottom, h - 8);
        const wx = gx + ox, wz = gz + oz;
        for (let y = h; y >= floor; y--) {
          const pos: P = [wx, y, wz];
          const depth = h - y;
          if (variant === "nether") bRack.push(pos);
          else if (depth === 0) (h <= WATER ? bSand : bGrass).push(pos);
          else if (depth === 1) bDirt.push(pos);
          else bStone.push(pos);
        }
      }
    }

    if (variant === "overworld") {
      for (let i = 0; i < 30; i++) {
        const gx = 3 + Math.floor(hash(i, 1) * (GRID_W - 6));
        const gz = 3 + Math.floor(hash(i, 2) * (GRID_D - 6));
        const base = H[gx][gz];
        if (base <= WATER + 1) continue;
        const wx = gx + ox, wz = gz + oz;
        const th = 4 + Math.floor(hash(i, 3) * 2);
        for (let k = 1; k <= th; k++) bLog.push([wx, base + k, wz]);
        const ly = base + th;
        bLeaves.push(
          [wx, ly + 1, wz],
          [wx + 1, ly, wz], [wx - 1, ly, wz], [wx, ly, wz + 1], [wx, ly, wz - 1],
          [wx + 1, ly - 1, wz], [wx - 1, ly - 1, wz], [wx, ly - 1, wz + 1], [wx, ly - 1, wz - 1],
          [wx + 1, ly, wz + 1], [wx - 1, ly, wz - 1]
        );
      }
    } else {
      for (let i = 0; i < 10; i++) {
        const gx = Math.floor(hash(i, 9) * GRID_W);
        const gz = Math.floor(hash(i, 8) * GRID_D);
        const gy = H[gx][gz] + 1;
        bGlow.push([gx + ox, gy, gz + oz]);
      }
    }

    /* ---- instanced meshes ---- */
    const dummy = new THREE.Object3D();
    const addInstanced = (
      material: THREE.Material | THREE.Material[],
      positions: P[],
      cast: boolean,
      receive: boolean
    ) => {
      if (!positions.length) return;
      const mesh = new THREE.InstancedMesh(box, material, positions.length);
      mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      mesh.castShadow = cast;
      mesh.receiveShadow = receive;
      mesh.frustumCulled = false;
      positions.forEach((p, i) => {
        dummy.position.set(p[0], p[1], p[2]);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      scene.add(mesh);
    };

    if (variant === "overworld") {
      addInstanced(matGrass, bGrass, true, true);
      addInstanced(matDirt!, bDirt, true, true);
      addInstanced(matStone!, bStone, true, true);
      addInstanced(matSand!, bSand, true, true);
      addInstanced(matLog, bLog, true, true);
      addInstanced(matLeaves!, bLeaves, false, true);
    } else {
      addInstanced(matRack!, bRack, true, true);
      addInstanced(matStone!, bStone, true, true);
      addInstanced(matGlow!, bGlow, false, false);
      bGlow.forEach((p) => {
        const pl = new THREE.PointLight(0xffb038, 1.1, 20);
        pl.position.set(p[0], p[1] + 1, p[2]);
        scene.add(pl);
      });
    }

    /* ---- water ---- */
    let water: THREE.Mesh | null = null;
    if (preset.hasWater && waterTex) {
      const wTex = waterTex.clone();
      wTex.wrapS = wTex.wrapT = THREE.RepeatWrapping;
      wTex.repeat.set(GRID_W / 2, GRID_D / 2);
      wTex.magFilter = THREE.NearestFilter;
      const wMat = new THREE.MeshBasicMaterial({
        map: wTex, color: preset.waterTint, transparent: true, opacity: 0.72,
      });
      water = new THREE.Mesh(new THREE.PlaneGeometry(GRID_W + 60, GRID_D + 60), wMat);
      water.rotation.x = -Math.PI / 2;
      water.position.y = WATER + 0.35;
      water.receiveShadow = true;
      scene.add(water);
      disposables.push(wTex, wMat, water.geometry);
    }

    /* ---- clouds ---- */
    let clouds: THREE.Group | null = null;
    if (preset.clouds && matCloud) {
      clouds = new THREE.Group();
      for (let i = 0; i < 6; i++) {
        const w = 4 + Math.floor(hash(i, 21) * 5);
        const d = 3 + Math.floor(hash(i, 22) * 3);
        const cm = new THREE.Mesh(new THREE.BoxGeometry(w, 1, d), matCloud);
        cm.position.set(-30 + hash(i, 23) * 60, 22 + hash(i, 24) * 8, -40 + hash(i, 25) * 30);
        clouds.add(cm);
        disposables.push(cm.geometry);
      }
      scene.add(clouds);
    }

    /* ---- sun / moon: bloom halo + god rays ---- */
    let rays: THREE.Sprite | null = null;
    if (preset.sun) {
      const hex = "#" + new THREE.Color(preset.sun.color).getHexString();
      const haloTex = glowSprite(hex);
      const haloMat = new THREE.SpriteMaterial({
        map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const halo = new THREE.Sprite(haloMat);
      halo.scale.setScalar(preset.sun.size * 3.4);
      halo.position.set(0, preset.sun.y, preset.sun.z);
      scene.add(halo);
      disposables.push(haloTex, haloMat);

      if (preset.sun.rays) {
        const rTex = rayTexture(hex);
        const rMat = new THREE.SpriteMaterial({
          map: rTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7,
        });
        rays = new THREE.Sprite(rMat);
        rays.scale.setScalar(preset.sun.size * 7);
        rays.position.set(0, preset.sun.y, preset.sun.z - 1);
        scene.add(rays);
        disposables.push(rTex, rMat);
      }
    }

    /* ---- voxel character standing on the terrain ---- */
    if (variant === "overworld") {
      const cMats = {
        skin: new THREE.MeshLambertMaterial({ color: 0xe8b48f }),
        hair: new THREE.MeshLambertMaterial({ color: 0x4a3120 }),
        shirt: new THREE.MeshLambertMaterial({ color: 0xd9d2c5 }),
        pants: new THREE.MeshLambertMaterial({ color: 0x2c3a56 }),
        eye: new THREE.MeshLambertMaterial({ color: 0x2a2440 }),
      };
      disposables.push(cMats.skin, cMats.hair, cMats.shirt, cMats.pants, cMats.eye);

      const person = new THREE.Group();
      const addPart = (
        w: number, h: number, d: number,
        x: number, y: number, z: number,
        m: THREE.Material
      ) => {
        const mesh = new THREE.Mesh(box, m);
        mesh.scale.set(w, h, d);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        person.add(mesh);
      };
      // legs
      addPart(0.42, 0.9, 0.5, -0.24, 0.45, 0, cMats.pants);
      addPart(0.42, 0.9, 0.5, 0.24, 0.45, 0, cMats.pants);
      // torso
      addPart(0.95, 1.05, 0.52, 0, 1.42, 0, cMats.shirt);
      // arms + hands
      addPart(0.34, 1.0, 0.5, -0.66, 1.42, 0, cMats.shirt);
      addPart(0.34, 1.0, 0.5, 0.66, 1.42, 0, cMats.shirt);
      addPart(0.34, 0.22, 0.5, -0.66, 0.98, 0, cMats.skin);
      addPart(0.34, 0.22, 0.5, 0.66, 0.98, 0, cMats.skin);
      // head + hair
      addPart(0.85, 0.85, 0.85, 0, 2.37, 0, cMats.skin);
      addPart(0.95, 0.42, 0.95, 0, 2.68, -0.02, cMats.hair);
      addPart(0.95, 0.85, 0.24, 0, 2.3, -0.4, cMats.hair);
      // eyes on the +z (camera-facing) side
      addPart(0.14, 0.16, 0.05, -0.2, 2.42, 0.44, cMats.eye);
      addPart(0.14, 0.16, 0.05, 0.2, 2.42, 0.44, cMats.eye);

      // find a flat, dry grass spot on the right bank near the river
      let cgx = 48, cgz = 40, found = false;
      for (let r = 0; r < 12 && !found; r++) {
        for (let dz = -r; dz <= r && !found; dz++) {
          for (let dx = -r; dx <= r && !found; dx++) {
            const gx = 48 + dx, gz = 40 + dz;
            if (gx < 3 || gz < 3 || gx >= GRID_W - 3 || gz >= GRID_D - 3) continue;
            const hh = H[gx][gz];
            if (hh <= WATER) continue;
            const flat =
              Math.abs(H[gx - 1][gz] - hh) + Math.abs(H[gx + 1][gz] - hh) +
              Math.abs(H[gx][gz - 1] - hh) + Math.abs(H[gx][gz + 1] - hh);
            if (flat <= 2) { cgx = gx; cgz = gz; found = true; }
          }
        }
      }
      person.position.set(cgx + ox, H[cgx][cgz] + 0.5, cgz + oz);
      person.rotation.y = 0.22;
      person.scale.setScalar(0.92);
      scene.add(person);
    }

    /* ---- camera (idle drift only) ---- */
    const camBaseY = WATER + 8;
    const lookZ = -GRID_D / 2 + 4;
    const driftAmp = 3.2 * parallax;

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* ---- render loop, gated by visibility ---- */
    let raf = 0;
    let running = false;
    let shadowsBaked = false;
    let lastDraw = 0;
    const MIN_FRAME_MS = 1000 / 30; // cap background at ~30fps
    const clock = new THREE.Clock();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      if (now - lastDraw < MIN_FRAME_MS) return;
      lastDraw = now;
      const t = clock.getElapsedTime();
      const sway = reduced ? 0 : Math.sin(t * 0.12) * driftAmp;
      const bobY = reduced ? 0 : Math.sin(t * 0.3) * 0.4;
      camera.position.set(sway, camBaseY + bobY, GRID_D / 2 + 5);
      camera.lookAt(sway * 0.35, WATER + 1.4, lookZ);

      if (water && water.material instanceof THREE.MeshBasicMaterial && water.material.map) {
        water.material.map.offset.y = (t * 0.03) % 1;
        water.material.map.offset.x = Math.sin(t * 0.2) * 0.02;
      }
      if (rays) {
        rays.material.rotation = t * 0.05;
        rays.material.opacity = 0.6 + Math.sin(t * 0.8) * 0.12;
      }
      if (clouds && !reduced) {
        clouds.children.forEach((c, i) => {
          c.position.x += 0.01 + i * 0.002;
          if (c.position.x > 42) c.position.x = -42;
        });
      }
      renderer.render(scene, camera);

      // terrain + light are static: bake the shadow map once, then freeze it.
      if (!shadowsBaked) {
        shadowsBaked = true;
        renderer.shadowMap.autoUpdate = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      clock.getDelta(); // discard the paused gap
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // Only render while the section is on screen and the tab is visible.
    let onScreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { threshold: 0.01 }
    );
    io.observe(mount);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((o) => {
        if (o instanceof THREE.InstancedMesh) o.dispose();
      });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [variant, night, parallax]);

  return <div ref={mountRef} className={`absolute inset-0 ${className}`} aria-hidden />;
}
