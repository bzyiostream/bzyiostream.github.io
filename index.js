const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d',{willReadFrequently:true});

function initCanvasSize(){
  canvas.width = window.innerWidth*devicePixelRatio;
  canvas.height = window.innerHeight*devicePixelRatio;
}

initCanvasSize()

function getRandom(min,max){
  return Math.floor(Math.random()*(max+1-min)+min)
}

class Particle{
  constructor(){
    const r = Math.min(canvas.width,canvas.height)/2;
    const cx = canvas.width/2;
    const cy = canvas.height/2;
    const rad = getRandom(0,360)*Math.PI/180;
    this.x = cx+r*Math.cos(rad);
    this.y = cy+r*Math.sin(rad);
    this.size = getRandom(2*devicePixelRatio,5*devicePixelRatio)
  }
  draw(){
    ctx.beginPath()
    ctx.fillStyle = '#5445544d'
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI)
    ctx.fill()
  }
  moveTo(tx,ty)
  {
    const duration = 500;
    const sx = this.x,sy=this.y;
    const xSpeed = (tx-sx)/duration;
    const ySpeed = (ty-sy)/duration;
    const startTime = Date.now();
    const _move = ()=>{
      const t = Date.now()-startTime;
      const x = sx+xSpeed*t;
      const y = sy+ySpeed*t;
      this.x = x;
      this.y = y;
      if(t>=duration)
      {
        this.x = tx;
        this.y = ty;
        return;
      }
      requestAnimationFrame(_move)
    }
    _move()
  }
}

function clear()
{
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

const particles = [];
let text = null;

function draw(){
  clear()
  update()
  particles.forEach((p)=>p.draw());
  requestAnimationFrame(draw)
}
draw()

function getText(){
  return new Date().toTimeString().substring(0,8)
}

function update()
{
  const nextText = getText();
  if(nextText===text)
  {
    return;
  }
  text = nextText;

  ctx.fillStyle = '#000';
  ctx.textBaseline = 'middle';
  ctx.font = `${140*devicePixelRatio}px sans-serif`
  const tw = ctx.measureText(text);
  console.log(tw)
  ctx.fillText(text,(canvas.width-tw.actualBoundingBoxRight - tw.actualBoundingBoxLeft)/2,canvas.height/2);
  const points = getPoints()
  clear()
  for(let i=0;i<points.length;i++){
    let p = particles[i];
    if(!p)
    {
      p=new Particle()
      particles.push(p)
    }
    const [x,y]= points[i]
    p.moveTo(x,y)
  }
  if(points.length<particles.length)
  {
    particles.splice(points.length)
  }
}

function getPoints(){
  const {width,height,data} = ctx.getImageData(0,0,canvas.width,canvas.height)
  const points = [];
  const prap = 2;
  for(let i=0;i<width;i+=prap)
  {
    for(let j=0;j<height;j+=prap)
    {
      const index = (i+j*width)*4;
      const r = data[index]
      const g = data[index+1]
      const b = data[index+2]
      const a = data[index+3]
      if(r===0&&g===0&&b===0&&a===255)
      {
        points.push([i,j])
      }
    }
  }
  // console.log(points)
  return points;
}
