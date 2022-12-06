let cnv

let xres
let yres
let margin
let g

let seed = ~~(fxrand() * 123456789)

const MIN_NODE_CHILDREN = 1
const MAX_NODE_CHILDREN = 2
let maxDepth

let palettes = []
let palette

let W = 1080
let H = 1920

// let marginMaskGp

function setup() {
  randomSeed(seed) // 102250032
  noiseSeed(seed) // 102250032
  console.log(`Current Seed: ${seed}`)

  pixelDensity(4)
  cnv = createCanvas(W, H, WEBGL)

  margin = W * 0.08
  xres = W / 20
  yres = H / 20
  maxDepth = 3

  noLoop()
  colorMode(HSL, 360, 100, 100, 100)
  setupPalettes()

  g = new G()
  g.distortNodes()
}

function setupPalettes() {
  palettes = [
    // { // Werner Light – No me gusta si se pinta las deformaciones
    //   baseColors: [
    //     color(213, 29, 59, 50), // Berlin blue
    //     color(339, 43, 50, 50), // Lake red
    //     color(239, 16, 50, 50), // Campanula purple
    //     // color(230, 3, 37, 50), // Blackish Grey
    //     color(47, 40, 48, 50), // Wax Yellow
    //     color(150, 31, 53, 50), // Verdigris Green
    //     // color(10, 12, 49, 50), // Brownish Purple Red
    //     // color(240, 30, 31, 50), // China Blue
    //     // color(312, 7, 14, 50), // Ink Black
    //     // color(264, 4, 26, 50), // Bluish Black
    //   ],
    //   bg: color(47, 42, 87),
    //   texture: color(51, 57, 47, 75),
    //   // starAlpha: 20,
    //   crayonAlpha: 3,
    //   isDark: false,
    // },
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
      texture: color(47, 56, 30, 85),
      isDark: true,
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
      texture: color(169, 32, 35, 78), // verditter blue
      isDark: true,
    },
    // { // pasteles
    //   baseColors: [
    //     color(351, 32, 64, 50),
    //     color(158, 14, 64, 50),
    //     color(55, 18, 59, 50),
    //     color(45, 54, 13, 50),
    //     color(305, 27, 57, 50),
    //   ],
    //   bg: color(36, 48, 76), // 
    //   texture: color(305, 27, 57, 70), // 
    //   isDark: false,
    // },
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
      texture: color(32, 32, 77, 75), // 
      isDark: false,
    },
    {
      baseColors: [
        color(0, 0, 97, 50),
        color(0, 0, 95, 50),
      ],
      bg: color(357, 69, 49),
      texture: color(color(0, 0, 97, 60)),
    },
  ]
  palette = random(palettes)
}

function bgRect() {
  const bg = color(
    hue(palette.bg),
    saturation(palette.bg),
    lightness(palette.bg) + (palette.isDark ? 5 : 10),
  )

  push()
  rectMode(CORNER)
  const spacing = 3
  const s = spacing + 5
  const wiggle = 1.35
  fill(bg)
  noStroke()

  for (let x = margin; x <= W - margin; x += spacing) {
    for (let y = margin; y <= H - margin; y += spacing) {
      rect(
        x + random(-wiggle, wiggle),
        y + random(-wiggle, wiggle),
        s,
        s
      )
    }
  }
  pop()
}

function draw() {
  background(palette.bg)
  push()
  translate(-width / 2, -height / 2)

  bgRect()

  const pen = new ThreeDPen(0.66, 6, '#ffffff')

  // const mx = (x) => constrain(
  //   map(x, 0, W, margin, W - margin + 3), margin, W - margin + 3
  // )
  // const my = (y) => constrain(
  //   map(y, 0, H, margin, H - margin + 3), margin, H - margin + 3
  // )
  for (let di = 0; di < g.nodeMutations.length; di++) {
    const mutations = g.nodeMutations[di]
    const node = g.nodeGrid[di]
    const mc = node.mergedColor

    // Shapes
    push()
    noStroke()
    const fc = color(
      hue(mc),
      saturation(mc),
      lightness(mc),
      palette.crayonAlpha || 1,
    )
    fill(fc)
    beginShape()
    for (const m of mutations) {
      const { x, y } = m

      if (
        x < margin ||
        x > W - margin ||
        y < margin ||
        y > H - margin
      ) {
        continue
      }

      vertex(x, y, 0)
    }
    endShape(CLOSE)
    pop()

    // Lines
    pen.setColor(color(
      hue(mc),
      saturation(mc),
      lightness(mc),
      alpha(palette.texture)
    ))
    pen.setConfig(0.09, 22)
    for (let i = 0; i < mutations.length - 1; i++) {
      const m = mutations[i]
      const nm = mutations[i + 1]
      if (!nm) return

      const { x, y } = m
      const { x: x2, y: y2 } = nm

      if (
        x < margin ||
        x > W - margin ||
        y < margin ||
        y > H - margin ||
        x2 < margin ||
        x2 > W - margin ||
        y2 < margin ||
        y2 > H - margin 
      ) {
        continue
      }

      pen.penLine(
        createVector(x, y, node.z),
        createVector(x2, y2, node.z),
      )
    }
    // mutations.forEach((m, i) => {
    //   const nm = mutations[i + 1]
    //   if (!nm) return

    //   const { x: nx, y: ny } = m
    //   const { x: nnx, y: nny } = nm

    //   pen.penLine(
    //     createVector(mx(nx), my(ny), node.z),
    //     createVector(mx(nnx), my(nny), node.z),
    //   )
    // })

    // Dots
    push()
    const dc = color(
      hue(mc),
      saturation(mc),
      lightness(mc),
      palette.starAlpha || 10,
    )
    strokeWeight(0.7)
    stroke(dc)
    for (const m of mutations) {
      const { x, y } = m
      let dots = g.distortionSize * 18.5
      while (dots--) {
        const dt = random(TAU)
        const dd = random(g.distortionSize * 0.9)
        const [ddx, ddy] = [dd * cos(dt), dd * sin(dt)]

        if (
          x + ddx < margin ||
          x + ddx > W - margin ||
          y + ddy < margin ||
          y + ddy > H - margin
        ) {
          continue
        }

        point(x + ddx, y + ddy, 0)
      }
    }
    // mutations.forEach((m) => {
    //   let dots = g.distortionSize * 18.5
    //   while (dots--) {
    //     const dt = random(TAU)
    //     const dd = random(g.distortionSize * 0.9)
    //     const [ddx, ddy] = [dd * cos(dt), dd * sin(dt)]

    //     point(
    //       mx(m.x) + ddx,
    //       my(m.y) + ddy,
    //       0
    //     )
    //   }
    // })
    pop()
  }

  // Draw connections
  push()
  pen.setConfig(0.6, 9)
  for (const p of g.nodeGrid) {
    for (const childrenId of p.childrenOrder) {
      const { node, strength } = p.children[childrenId]

      pen.setAlpha(map(
        strength,
        0.1,
        0.85,
        30,
        100
      ))
      pen.penLine(p.pos, node.pos, true, p.mergedColor, node.mergedColor)
    }
  }
  pop()

  // Draw nodes
  push()
  strokeWeight(9)
  for (const p of g.nodeGrid) {
    push()
    translate(p.x, p.y, p.z)

    p.display()

    const pc = color(p.mergedColor)
    pc.setAlpha(90)
    pen.setColor(pc)
    pen.setConfig(0.5, 15)
    pen.circle(0, 0, 0, 15, Axis.X, 0.45)
    pen.circle(0, 0, 0, 15, Axis.Y, 0.45)
    pen.circle(0, 0, 0, 15, Axis.Z, 0.45)

    pop()
  }
  // pop()

  pop()
}
