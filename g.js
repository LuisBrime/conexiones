class G {
  constructor() {
    this.gridX = []
    this.gridY = []

    this.nodeGrid = []
    this.nodeMutations = []

    this.initGrid()
  }

  initGrid() {
    for (let x = 0; x <= W; x += xres) {
      this.gridX.push(x)
    }

    for (let y = 0; y <= H; y += yres) {
      this.gridY.push(y)
    }

    for (let i = 0; i < this.gridX.length; i++) {
      for (let j = 0; j < this.gridY.length; j++) {
        this.nodeGrid.push(new Node({
          i,
          j,
          id: this.nodeGrid.length + 1,
          x: this.gridX[i],
          y: this.gridY[j],
          z: 1,
          c: random(palette.baseColors),
        }))
      }
    }

    this.distortionSize = 40
    this.selectNodes()
  }

  selectNodes() {
    this.nodeGrid = this.nodeGrid.reduce((a, c) => {
      if (noise(c.x * 0.5, c.y * 0.9, c.z * 1.3) < 0.42) {
        return [...a, c]
      }
      return a
    }, [])

    this.connectNodes()
  }

  connectNodes() {
    for (const n of this.nodeGrid) {
      const nCh = floor(
        random(MIN_NODE_CHILDREN, MAX_NODE_CHILDREN)
      )

      for (let ci = 0; ci < nCh; ci++) {
        const di = abs((n.i + ceil(random(-maxDepth - 1, maxDepth))) % this.gridX.length)
        const dj = abs((n.j + ceil(random(-maxDepth - 1, maxDepth))) % this.gridY.length)

        if (di === n.i && dj === n.j) continue

        const child = this.nodeGrid.find((n2) => n2.i === di && n2.j === dj)

        if (!child) continue

        const depth = n.getDepth(child)
        n.addChild(child, depth, random(0.1, 0.85))
      }

      n.sortChildren()
    }
  }

  distortNodes() {
    for (const node of this.nodeGrid) {
      // const mc = node.mergedColor

      push()
      let [ix, iy] = [node.x, node.y]
      let distortions = 40
      const xdir = random([-1, 1])
      const ydir = random([-1, 1])

      let vs = []
      while (distortions--) {
        // Draw path
        vs.push({ x: ix, y: iy })
        // Update position
        const nt = noise(ix * 5.2, iy * 5.2) * TAU
        ix += cos(nt) * this.distortionSize * xdir
        iy += sin(nt) * this.distortionSize * ydir
      }

      this.nodeMutations.push(vs)
      node.pos.x = ix
      node.pos.y = iy
      pop()
    }
  }
}
