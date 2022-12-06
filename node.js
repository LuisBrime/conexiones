class Node {
  constructor({
    id,
    x,
    y,
    z,
    i,
    j,
    c,
  }) {
    this.id = id
    this.pos = createVector(x, y, z)
    this.children = {}
    this.childrenOrder = []
    this.i = i
    this.j = j
    this.c = color(c)
  }

  get numOfChildren() {
    return Object.keys(this.children).length
  }

  get x() {
    return this.pos.x
  }

  get y() {
    return this.pos.y
  }

  get z() {
    return this.pos.z
  }

  get mergedColor() {
    let baseColor = color(this.c)
    for (const cid of this.childrenOrder) {
      const { node, strength } = this.children[cid]
      baseColor = lerpColor(baseColor, node.c, strength)
    }
    return baseColor
  }

  addChild(node, depth, strength) {
    if (!node) console.log(`help: ${node}`)
    if (this.children[node.id]) return
    this.children[node.id] = { depth, node, strength }
    this.childrenOrder.push(node.id)
  }

  getDepth(other) {
    const dx = abs(this.i - other.i)
    const dy = abs(this.j - other.j)
    return max(dx, dy)
  }

  sortChildren() {
    this.childrenOrder.sort(
      (a, b) => this.children[a].depth - this.children[b].depth
    )
  }

  randomChildrenNode() {
    if (!this.childrenOrder.length) return null;
    const rid = random(this.childrenOrder)
    return this.children[rid].node
  }

  display() {
    push()
    const c = color(this.mergedColor)
    c.setAlpha(85)
    let dots = 8000
    while (dots--) {
      stroke(c)
      strokeWeight(0.15)

      if (random() > 0.75) {
        const rcn = this.randomChildrenNode()
        if (rcn) {
          const cc = color(rcn.c)
          cc.setAlpha(85)
          stroke(cc)
          strokeWeight(0.25)
        }
      }

      const pt = random(TAU)
      const d = random(4)
      const [px, py] = [d * cos(pt), d * sin(pt)]

      point(
        px * random(1, 1.35),
        py * random(1, 1.35),
        this.pos.z,
      )
    }
    pop()
  }
}
