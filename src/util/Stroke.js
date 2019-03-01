import Point from './Point'

export default class Stroke {
  constructor( points ) {
    this.bounds = [
      new Point(0,0),
      new Point(0,0)
    ]
  }

  addPoint() {

  }

  findBounds() {
    if(x < this.bounds[0].x)
      this.bounds[0].x = x
    else if (x > this.bounds[1].x)
      this.bounds[1].x = x

    if(y < this.bounds[0].y)
      this.bounds[0].y = y
    else if (y > this.bounds[1].y)
      this.bounds[1].y = y
  }

}
