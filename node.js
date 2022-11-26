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
}
