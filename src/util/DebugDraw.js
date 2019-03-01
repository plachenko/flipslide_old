export default class DebugDraw {
  constructor( canvas ) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    if (this.$eventHub.debug) {
      //TODO: set debug object in data and get offset, width of element, and style
    }
  }

  drawStuff() {
    this.dbgCtx.clearRect(0, 0, this.w, this.h)

    this.dbgCtx.fillRect(n[0].x - 1, n[0].y - 1, 3, 3)
    this.dbgCtx.fillRect(n[len].x - 1, n[len].y - 1, 3, 3)

    this.dbgCtx.beginPath()
    this.dbgCtx.strokeStyle = 'rgba(0, 0, 255, 1)';
    this.dbgCtx.moveTo(this.stroke[0].x, this.stroke[0].y)
    this.dbgCtx.lineTo(n[len].x, n[len].y)
    this.dbgCtx.stroke()

    this.dbgCtx.beginPath()
    this.dbgCtx.strokeStyle = 'rgba(0, 0, 0, 1)';
    this.dbgCtx.moveTo(this.bounds.x[0], this.bounds.y[1])
    this.dbgCtx.lineTo(this.bounds.x[0], this.bounds.y[0])
    this.dbgCtx.lineTo(this.bounds.x[1], this.bounds.y[0])
    this.dbgCtx.lineTo(this.bounds.x[1], this.bounds.y[1])
    this.dbgCtx.lineTo(this.bounds.x[0], this.bounds.y[1])
    this.dbgCtx.stroke()

    this.dbgCtx.beginPath();
    this.dbgCtx.strokeStyle = 'rgba(255, 0, 255, 1)';
    this.dbgCtx.moveTo(n[len].x, n[len].y)
    this.dbgCtx.lineTo(n[len].x, n[0].y)
    this.dbgCtx.lineTo(n[0].x, n[0].y)
    this.dbgCtx.lineTo(n[0].x, n[len].y)
    this.dbgCtx.lineTo(n[len].x, n[len].y)
    this.dbgCtx.stroke()

    this.dbgCtx.beginPath();
    this.dbgCtx.strokeStyle = 'rgba(255, 0, 0, 1)';
    this.dbgCtx.arc(n[len].x, n[len].y, 50, 0, 2 * Math.PI);
    this.dbgCtx.stroke();
  }

  setInfoPosition(){

    if(this.stroke.bounds[1].x < this.w - 170){
      this.$refs.debug.style.left = this.stroke.bounds[1].x + 20 + "px"
    } else {
      this.$refs.debug.style.right = 0 + "px"
    }

    if(this.stroke.bounds[1].y < this.h - 120){
      this.$refs.debug.style.top = this.stroke.bounds[1].y + 20 + "px"
    } else {
      this.$refs.debug.style.bottom = 0 + "px"
    }
  }


}
