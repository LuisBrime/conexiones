const Axis = {
  X: 0,
  Y: 1,
  Z: 2,
};

class ThreeDPen {
  constructor(sW, bW, c) {
    this.sW = sW
    this.bW = bW
    this.c = color(c)
  }

  setColor(color) {
    this.c = color
  }

  setAlpha(alpha) {
    this.c.setAlpha(alpha)
  }

  setConfig(sW, bW) {
    this.sW = sW
    this.bW = bW
  }

  penLine(p1, p2, details = true, c1 = this.c, c2 = this.c) {
    push()
    const d = p2.dist(p1)
    const steps = ceil(d * 5)
    
    const [dx, dy, dz] = [
      (p2.x - p1.x) / steps,
      (p2.y - p1.y) / steps,
      (p2.z - p1.z) / steps,
    ]

    const maxCircles = floor(d * 0.05)
    let currentCircles = 0
    let recentCircle = false

    const offset = random(-5, 5)
    for (let i = 0; i < steps; i++) {
      const currentColor = lerpColor(c1, c2, (i + 1) / steps)
      stroke(currentColor)
      const [nx, ny, nz] = [
        p1.x + i * dx,
        p1.y + i * dy,
        p1.z * i * dz,
      ]

      if (noise(
          nx * 0.05 + offset,
          ny * 0.05 + offset,
          nz * 0.05 + offset
      ) < 0.396) {
        strokeWeight(0)

        // Draw circle if no stroke and probability
        if (
          details &&
          !recentCircle &&
          currentCircles < maxCircles &&
          noise(nx * 0.01 + offset, ny * 0.01 + offset, nz * 0.01 + offset) < 0.335
        ) {
          this.circle(
            nx,
            ny,
            nz,
            random(6,8),
            random([Axis.X, Axis.Y, Axis.Z]),
            0.356,
            currentColor
          )
          recentCircle = true
          currentCircles++
        }
      } else {
        strokeWeight(
          noise(
            nx * 0.25 + offset,
            ny * 0.25 + offset,
            nz * 0.25 + offset
          ) * this.sW / 4.5 * this.bW +
          random(this.sW / 4, this.sW / 2) / 2
        )

        recentCircle = false
      }

      point(nx, ny, nz)

      if (
        details &&
        noise(nx * 0.1 + offset, ny * 0.1 + offset, nz * 0.1 + offset) < 0.235 && i % 2 !== 0
      ) {
        const currentV = createVector(nx, ny, nz)

        let plane
        const ch = random()
        if (ch < 0.33) {
          plane = createVector(currentV.x, 0, 0)
        } else if (ch < 0.66) {
          plane = createVector(0, currentV.y, 0)
        } else {
          plane = createVector(0, 0, currentV.z)
        }
        const negPlane = p5.Vector.mult(plane, -1)

        const nV1 = p5.Vector.cross(currentV, plane)
        nV1.limit(3)
        nV1.mult(2)
        const nV2 = p5.Vector.cross(currentV, negPlane)
        nV2.limit(3)
        nV2.mult(2)

        line(
          currentV.x + nV1.x, currentV.y + nV1.y, currentV.z + nV1.z,
          currentV.x + nV2.x, currentV.y + nV2.y, currentV.z + nV2.z
        )
      }

      if (
        details &&
        noise(nx * 0.1 + offset, ny * 1.5 + offset, nz * 0.5 + offset) < 0.5
      ) {
        const currentV = createVector(nx, ny, nz)
        let plane
        const ch = random()
        if (ch < 0.33) {
          plane = createVector(currentV.x, 0, 0)
        } else if (ch < 0.66) {
          plane = createVector(0, currentV.y, 0)
        } else {
          plane = createVector(0, 0, currentV.z)
        }
        plane = p5.Vector.mult(plane, random([-1, 1]))

        const nV = p5.Vector.cross(currentV, plane)
        nV.limit(1)
        nV.mult(10)

        point(nV.x, nV.y, nV.z)
      }
    }
    pop()
  }

  circle(
    x,
    y,
    z,
    r,
    plane = Axis.X,
    strokeThreshold = 0.246,
    c = this.c,
  ) {
    push()
    stroke(c)
    translate(x, y, z)

    const offset = random(-0.5, 0.5)
    for (let theta = 0; theta < TAU; theta += TAU / (r * 20)) {
      let nx, ny, nz;

      switch (plane) {
        case Axis.X:
          nx = 0
          ny = r * cos(theta)
          nz = r * sin(theta)
          break
        
        case Axis.Y:
          nx = r * cos(theta)
          ny = 0
          nz = r * sin(theta)
          break
        
        case Axis.Z:
          nx = r * cos(theta)
          ny = r * sin(theta)
          nz = 0
          break
      }

      if (noise(
        nx * 0.35 + offset,
        ny * 0.35 + offset,
        nz * 0.35 + offset
      ) < strokeThreshold) {
        strokeWeight(0)
      } else {
        strokeWeight(
          noise(
            nx * 0.25 + offset,
            ny * 0.25 + offset,
            nz * 0.25 + offset
          ) * this.sW / 4.5 * this.bW +
          random(this.sW / 4, this.sW / 2) / 2
        )
      }

      point(nx, ny, nz)
    }

    pop()
  }
}
