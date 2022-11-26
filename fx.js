const fxrandom = (a, b) => {
  if (a instanceof Array) {
    return a[floor(fxrand() * a.length)]
  } else if (a && b) {
    return fxrand() * (b - a) + a
  } else if (a) {
    return fxrand() * a
  }
  return fxrand()
}

const coin = () => fxrand() < 0.5

const chance = (weight = 0.5) => fxrand() < weight

const randomVect = () => createVector(fxrand(), fxrand())

const random3Vect = () => createVecotr(fxrand(), fxrand(), fxrand())


