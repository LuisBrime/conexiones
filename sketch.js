let xres
let yres
let xmargin
let ymargin
let gridX = []
let gridY = []
let gridPoints = []
let nodes = []

let seed = ~~(fxrand() * 123456789)

const MIN_NODE_CHILDREN = 1
const MAX_NODE_CHILDREN = 2

let palettes = []

let showTexture

function setup() {
  randomSeed(102250032)
  noiseSeed(102250032)
  console.log(`Current Seed: ${seed}`)

  pixelDensity(4)
  createCanvas(1080, 1920, WEBGL)

  xres = width / 10
  yres = height / 20

  noLoop()
  colorMode(HSL, 360, 100, 100, 100)
  setupPalettes()

  initGrid()

  showTexture = true
}

let palette
function setupPalettes() {
  palettes = [
    { // Werner Light
      baseColors: [
        color(213, 29, 59, 50), // Berlin blue
        color(339, 43, 50, 50), // Lake red
        color(239, 16, 50, 50), // Campanula purple
        color(230, 3, 37, 50), // Blackish Grey
        color(47, 40, 48, 50), // Wax Yellow
        color(150, 31, 53, 50), // Verdigris Green
        color(10, 12, 49, 50), // Brownish Purple Red
        color(240, 30, 31, 50), // China Blue
        color(312, 7, 14, 50), // Ink Black
        color(264, 4, 26, 50), // Bluish Black
      ],
      bg: color(47, 42, 87),
      texture: color(51, 57, 47, 5),
    },
    { // Werner dark
      baseColors: [
        color(213, 29, 59, 50), // Berlin blue
        color(339, 43, 50, 50), // Lake red
        color(239, 16, 50, 50), // Campanula purple
        color(41, 65, 49, 50), // Safron Yellow
        color(150, 31, 53, 50), // Verdigris Green
        color(47, 56, 87, 50), // Snow White
        color(52, 16, 76, 50), // Ash Grey
        color(156, 6, 83, 50), // Bluish Lilac Purple
      ],
      bg: color(264, 4, 26),
      texture: color(47, 56, 30, 1),
    },
    {
      baseColors: [
        color(47, 59, 87, 50), // yellowish white
        color(225, 39, 56, 50), // ultramarine blue
        color(217, 29, 56, 50), // flax-flower blue
        color(20, 58, 84, 50), // peach blossom red
        color(348, 56, 57, 50), // carmine red
        color(51, 74, 62, 50), // gamboe yellow
      ],
      bg: color(256, 18, 25), // pansy purple
      texture: color(169, 32, 35, 1), // verditter blue
    },
    { // pasteles
      baseColors: [
        color(351, 32, 64, 50),
        color(158, 14, 64, 50),
        color(55, 18, 59, 50),
        color(45, 54, 13, 50),
        color(305, 27, 57, 50),
      ],
      bg: color(36, 48, 76), // 
      texture: color(305, 27, 57, 6), // 
    },
    { // caminos
      baseColors: [
        color(2, 63, 70, 50),
        color(355, 61, 51, 50),
        color(235, 70, 48, 50),
        color(89, 31, 37, 50),
        color(330, 81, 56, 50),
        color(195, 65, 65, 50),
        color(42, 74, 60, 50),
        color(56, 97, 65, 50),
      ],
      bg: color(43, 90, 96), // 
      texture: color(32, 32, 77, 15), // 
    },
  ]
  palette = random(palettes)
}

function initGrid() {
  for (let x = 0; x <= width; x += xres) {
    gridX.push(x);
  }

  for (let y = 0; y <= height; y += yres) {
    gridY.push(y);
  }

  for (let i = 0; i < gridX.length; i++) {
    for (let j = 0; j < gridY.length; j++) {
      const node = new Node({
        i,
        j,
        id: gridPoints.length + 1,
        x: gridX[i],
        y: gridY[j],
        z: 0,
        c: random(palette.baseColors),
      });
      // const p = createVector(gridX[i], gridY[j], 0)

      const rot = map(
        noise(node.x * 0.01, node.y * 0.01),
        0,
        1,
        0,
        TAU
      )
      node.pos.x += sin(rot) * 120
      node.pos.y += cos(rot) * 120
      // const rot = map(noise(p.x / 20, p.y / 20), 0, 1, 0, TAU)
      // p.x += sin(rot) * 50
      // p.y += cos(rot) * 50

      const zrot = map(
        noise(node.y * 2, node.x * 2),
        0,
        1,
        0,
        TAU
      )
      node.pos.z = (sin(zrot) + cos(zrot)) * 3
      // const zrot = map(noise(p.y * 5, p.x * 5), 0, 1, 0, TAU)
      // p.z = (sin(zrot) + cos(zrot)) * 50

      gridPoints.push(node)
    }
  }

  selectNodes()
}

function selectNodes() {
  gridPoints = gridPoints.reduce((acc, curr) => {
    if (
      noise(curr.x * 0.5, curr.y * 0.9, curr.z * 1.3) < 0.47
    ) {
      return [...acc, curr]
    } else {
      return acc
    }
  }, [])

  connectNodes()
}

function connectNodes() {
  for (const node of gridPoints) {
    const numChildren = floor(
      random(MIN_NODE_CHILDREN, MAX_NODE_CHILDREN)
    )

    for (let ci = 0; ci < numChildren; ci++) {
      const di = abs((node.i + ceil(
        random(-MAX_NODE_CHILDREN - 1, MAX_NODE_CHILDREN)
      )) % gridX.length)
      const dj = abs((node.j + ceil(
        random(-MAX_NODE_CHILDREN - 1, MAX_NODE_CHILDREN)
      )) % gridY.length)

      if (di === node.i && dj === node.j) continue

      const child = gridPoints.find(
        (node) => node.i === di && node.j === di
      )

      if (!child) continue
      const depth = node.getDepth(child)
      node.addChild(child, depth, random(0.1, 0.85))
    }

    node.sortChildren()
    nodes.push(node)
  }

  // nodes.filter((node) => node.childrenOrder.length > 0)
  // selectNodes()
}

function draw() {
  background(palette.bg)

  push()
  translate(-width / 2, -height / 2)

  const pen = new ThreeDPen(0.66, 6, '#ffffff')

  push()
  pen.setConfig(0.6, 9)
  for (const p of nodes) {
    for (const childrenId of p.childrenOrder) {
      const { node, strength } = p.children[childrenId]

      // const cappedDepth = constrain(
      //   depth,
      //   MIN_NODE_CHILDREN,
      //   MAX_NODE_CHILDREN - 1
      // )
      // pen.setAlpha(map(
      //   cappedDepth,
      //   MIN_NODE_CHILDREN,
      //   MAX_NODE_CHILDREN - 1,
      //   220,
      //   15
      // ))

      pen.setAlpha(map(
        strength,
        0.1,
        0.85,
        50,
        220
      ))
      pen.penLine(p.pos, node.pos, true, p.mergedColor, node.mergedColor)
    }
  }
  pop()

  push()
  strokeWeight(9)
  for (const p of nodes) {
    push()
    const pc = color(p.mergedColor)
    pc.setAlpha(90)

    pen.setColor(pc)
    pen.setConfig(0.5, 15)
    pen.circle(p.x, p.y, p.z, 15, Axis.X, 0.45)
    pen.circle(p.x, p.y, p.z, 15, Axis.Y, 0.45)
    pen.circle(p.x, p.y, p.z, 15, Axis.Z, 0.45)

    stroke(pc)
    point(p.x, p.y, p.z)
    pop()
  }
  pop()

  if (showTexture) addTexture()

  pop()
}

function addTexture() {
  let padfactor = 1000
  let loops = 5000
  const baseTextureC = color(palette.texture)
  const [h, s, l, a] = [
    hue(baseTextureC),
    saturation(baseTextureC),
    lightness(baseTextureC),
    alpha(baseTextureC),
  ]
  while (loops--) {
    push()
    strokeWeight(0.25)
    stroke(color(h, s, random(l, l + 30), random(a, a + 5)))
    noFill()
    bezier(
      random(-padfactor, width + padfactor),
      random(-padfactor, height + padfactor),
      random(-padfactor, width + padfactor),
      random(-padfactor, height + padfactor),
      random(-padfactor, width + padfactor),
      random(-padfactor, height + padfactor),
      random(-padfactor, width + padfactor),
      random(-padfactor, height + padfactor),
    )
    pop()
  }

  if (isFxpreview) fxpreview()
}

function keyTyped() {
  if (key === 't' || key === 'T') {
    showTexture = !showTexture
    redraw()
  }
}
