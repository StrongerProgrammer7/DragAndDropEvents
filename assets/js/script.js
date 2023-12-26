// @ts-nocheck
const elems = document.getElementById('elements');
const boxFlex = document.querySelector('#box_flex');
const boxFreedom = document.querySelector('#box_freedom');
const backgroundBoxFlex = document.querySelector('#color_backgroundFlex');
const backgroundBoxFreedom = document.querySelector('#color_backgroundFreedom');

let isDown = false;
let absCopyNode = null;
let offset = [0,0 ];
const coordinateByDivFreedom = [ 0,0];
const preloadedImages = {};
let coordinateMouseOnImg_X = 0;
let coordinateMouseOnImg_Y = 0;

const isMoveElem = (elem) =>
{
    return isDown === true && elem !== null;
}

const isCurrentBox = (target,idBox) =>
{
    let parent = target?.parentNode;
    return target && (target?.id === idBox || (parent && parent.id === idBox));
}

const moveElemWithMouse = (event,elem) =>
{
    elem.style.left = (event.clientX + offset[0]) + 'px';
    elem.style.top  = (event.clientY + offset[1]) + 'px';
}

const moveElem = (e) =>
{
    e.preventDefault();  
    if(isMoveElem(absCopyNode))
    {
        moveElemWithMouse(e,absCopyNode);
        if(isCurrentBox(e.target,'box_flex'))
        {
            addBackgroundToBox(backgroundBoxFlex,'boxFlexChangeBackground');
        }else if (isCurrentBox(e.target,'box_freedom'))
        {
            addBackgroundToBox(backgroundBoxFreedom,'boxFreedomChangeBackground');
        }else
        {
            removeBackgroundToBox(backgroundBoxFlex,'boxFlexChangeBackground');
            removeBackgroundToBox(backgroundBoxFreedom,'boxFreedomChangeBackground');
        }
    }
}

const saveCoordinateMouseOnTheImage = (elem,event) =>
{
    const rect = elem.getBoundingClientRect();
    coordinateMouseOnImg_X = event.clientX - rect.left;
    coordinateMouseOnImg_Y = event.clientY - rect.top;
}

const addBackgroundToBox = (elem,...classlist) =>
{
    if(elem.classList.contains(...classlist)===false)
        elem.classList.add(...classlist);
}

const removeBackgroundToBox = (elem, ...classlist) =>
{
    if(elem.classList.contains(...classlist)===true)
        elem.classList.remove(...classlist);
}

const createSpan = (letter,color) =>
{
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.color = color;
    return span;
}
const createBeautifulWord = (idElem,str,...colors) =>
{
    const title = document.getElementById(idElem);
    for(let i =0, j = 0;i<str.length;i++,j++)
    {
        if(colors[j] === undefined)
            j = 0;
        title.appendChild(createSpan(str[i],colors[j]));
    }
}

document.addEventListener('DOMContentLoaded',(e) =>
{
    console.log('DOM loaded');
    let imgs = elems?.querySelectorAll('img');
    imgs?.forEach(elem => 
        {
            if(elem)
            {
                if (!preloadedImages[elem.src]) 
                {
                    preloadedImages[elem.src] = new Image();
                    preloadedImages[elem.src].src = elem.src;
                    preloadedImages[elem.src].className = 'elements__img';
                }
                
                elem.addEventListener('pointerdown',(e)=>
                {
                    //absCopyNode = elem.cloneNode();
                    absCopyNode = new Image();
                    absCopyNode.className = preloadedImages[elem.src].className;
                    absCopyNode.src = preloadedImages[elem.src].src;

                    elem.after(absCopyNode);
                    saveCoordinateMouseOnTheImage(elem,e);
                   
                    absCopyNode.style = 'position:absolute; border-radius: 50%;';
                    
                    offset = [
                        elem.offsetLeft - e.clientX,
                        elem.offsetTop - e.clientY
                    ];

                    moveElemWithMouse(e,absCopyNode);
                    isDown = true;
                    document.addEventListener('pointermove',moveElem ,true);
                },true);
                
                elem.ondragstart = () =>
                {
                    return false;
                }
            }

        });

    createBeautifulWord('elementsTitle','Elements','red','purple','','red','blue','red','purple','#CB401B','blue','#30360F','red','','#EBD3B7','#D04861');
    createBeautifulWord('titleFlex','Flex','#CB401B','blue','#30360F','red','#EBD3B7','#D04861');
    createBeautifulWord('titleFreedom','Freedom','green','blue','#30360F','red','cyan','#D04861');
});

if(boxFreedom)
{
    boxFreedom.addEventListener('pointermove',(e) =>
    {
        if(isMoveElem(absCopyNode))
        {
            const rect = boxFreedom.getBoundingClientRect();

            coordinateByDivFreedom[0] = e.clientX - rect.left - coordinateMouseOnImg_X;//(absCopyNode.width / 2); - if center of cursor on mouse
            coordinateByDivFreedom[1] = e.clientY - rect.top - coordinateMouseOnImg_Y;//(absCopyNode.height / 2 ); - if center of cursor on mouse
        
        }
    });
}

document.addEventListener('pointerup', (e) =>
{
    if(isMoveElem(absCopyNode) === true)
    {

        if( isCurrentBox(e.target,'box_flex'))
        {
            console.log('flex');
            removeBackgroundToBox(backgroundBoxFlex,'boxFlexChangeBackground');
            absCopyNode.style = 'position:relative;';
            boxFlex.appendChild(absCopyNode);
        }else if(isCurrentBox(e.target,'box_freedom'))
        {
            console.log('freedom');
            removeBackgroundToBox(backgroundBoxFreedom,'boxFreedomChangeBackground');
            boxFreedom.appendChild(absCopyNode);
            //absCopyNode.style.imageRendering = 'pixelated';
            absCopyNode.style.left =  coordinateByDivFreedom[0] + 'px';
            absCopyNode.style.top  = coordinateByDivFreedom[1] + 'px';
        }else 
        {
            elems.removeChild(absCopyNode); 
        }
        document.removeEventListener('pointermove',moveElem,true);
    }
    
    isDown = false;
    absCopyNode = null;
},true);

if (document.addEventListener) 
{
    if ('onwheel' in document) 
    {
      // IE9+, FF17+, Ch31+
        document.addEventListener("wheel", onWheel);
    } else if ('onmousewheel' in document) 
    {
      // устаревший вариант события
        document.addEventListener("mousewheel", onWheel);
    } else 
    {
      // Firefox < 17
        document.addEventListener("MozMousePixelScroll", onWheel);
    }
} else 
{ // IE8-
    document.attachEvent("onmousewheel", onWheel);
}

function onWheel(e) 
{
    e = e || window.event;

    // wheelDelta не даёт возможность узнать количество пикселей
    var delta = e.deltaY || e.detail || e.wheelDelta;
    if(isMoveElem(absCopyNode) && e.target && e.target.id !== 'box_freedom')
    {
        offset[1] += delta;
    }
}




//--------------------------------------------- Animation Snow
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let width, height, lastNow;
let snowflakes;
const maxSnowflakes = 100;
let delay = 0;
const duration = 10;
const time = new Date().getTime();
const colors = ['red','blue','white'];

function randomColorSnow(t)
{
    if (t < delay)
        return 0;

    delay += duration;
    let r = Math.floor(rand(1,15));
    if (r > 10)
        ctx.fillStyle = ctx.strokeStyle = colors[0];
    else if(r > 5)
        ctx.fillStyle = ctx.strokeStyle = colors[1];
    else
        ctx.fillStyle = ctx.strokeStyle = colors[2];
}
function init() 
{
    snowflakes = []
    resize()
    render(lastNow = performance.now())
}

function render(now) 
{
    requestAnimationFrame(render)
    
    const elapsed = now - lastNow
    lastNow = now
    
    ctx.clearRect(0, 0, width, height)
    if (snowflakes.length < maxSnowflakes)
        snowflakes.push(new Snowflake());

    let t = (new Date().getTime() - time) / 1000;
    randomColorSnow(t);
   // console.log(Math.ceil(t));
    snowflakes.forEach(snowflake => snowflake.update(elapsed, now))
}

function pause() 
{
    cancelAnimationFrame(render)
}
function resume() 
{
    lastNow = performance.now()
    requestAnimationFrame(render)
}


class Snowflake 
{
    constructor() 
    {
        this.spawn()
    }
  
    spawn(anyY = false) 
    {
        this.x = rand(0, width)
        this.y = anyY === true
        ? rand(-50, height + 50)
        : rand(-50, -10)
        this.xVel = rand(-.05, .05)
        this.yVel = rand(.02, .1)
        this.angle = rand(0, Math.PI * 2)
        this.angleVel = rand(-.001, .001)
        this.size = rand(7, 12)
        this.sizeOsc = rand(.01, .5)
    }
  
    update(elapsed, now) 
    {
        const xForce = rand(-.001, .001);

        if (Math.abs(this.xVel + xForce) < .075)
        {
            this.xVel += xForce
        }
        
        this.x += this.xVel * elapsed
        this.y += this.yVel * elapsed
        this.angle += this.xVel * 0.05 * elapsed //this.angleVel * elapsed
        
        if (
        this.y - this.size > height ||
        this.x + this.size < 0 ||
        this.x - this.size > width
        ) {
            this.spawn()
        }
        
        this.render()
    }
  
    render() 
    {
        ctx.save()
        const { x, y, angle, size } = this
        ctx.beginPath()
        ctx.arc(x, y, size * 0.2, 0, Math.PI * 2, false)
        ctx.fill()
        ctx.fillStyle = ctx.strokeStyle = colors[2];
        ctx.restore()
    }
}

// Utils
const rand = (min, max) => min + Math.random() * (max - min)

function resize() 
{
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
}

window.addEventListener('resize', resize)
window.addEventListener('blur', pause)
window.addEventListener('focus', resume)
init()