// @ts-nocheck
const elems = document.getElementById('elements');
const boxFlex = document.querySelector('#box_flex');
const boxFreedom = document.querySelector('#box_freedom');
let isDown = false;
let absCopyNode = null;
let offset = [0,0 ];
const coordinateByDivFreedom = [ 0,0];
document.addEventListener('DOMContentLoaded',(e) =>
{
    console.log('DOM loaded');
    let imgs = elems?.querySelectorAll('img');
    imgs?.forEach(elem => 
        {
            if(elem)
            {
                elem.addEventListener('pointerdown',(e)=>
                {
                    absCopyNode = elem.cloneNode();
                    
                    elem.after(absCopyNode);
                    absCopyNode.style = 'position:absolute;';
                    
                    offset = [
                        elem.offsetLeft - e.clientX,
                        elem.offsetTop - e.clientY
                    ];
                    absCopyNode.style.left = (e.clientX + offset[0]) + 'px';
                    absCopyNode.style.top  = (e.clientY + offset[1]) + 'px';
                    isDown = true;
                },true);
            }

        })
});

const isMoveElem = (elem) =>
{
    return isDown === true && elem !== null;
}

const isCurrentBox = (target,idBox) =>
{
    let parent = target?.parentNode;
    return target && (target?.id === idBox || (parent && parent.id === idBox));
}

document.addEventListener('pointermove', (e) =>
{
    e.preventDefault();  
    if(isDown === true && absCopyNode !== null)
    {
        absCopyNode.style.left = (e.clientX + offset[0]) + 'px';
        absCopyNode.style.top  = (e.clientY + offset[1]) + 'px';
    }
},true);
if(boxFreedom)
{
    boxFreedom.addEventListener('pointermove',(e) =>
    {
        if(isMoveElem(absCopyNode))
        {
            const rect = boxFreedom.getBoundingClientRect();
            coordinateByDivFreedom[0] = e.clientX - rect.left-50;
            coordinateByDivFreedom[1] = e.clientY - rect.top-50;
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
            absCopyNode.style = 'position:relative;';
            boxFlex.appendChild(absCopyNode);
        }else if(isCurrentBox(e.target,'box_freedom'))
        {
            console.log('freedom');
            boxFreedom.appendChild(absCopyNode);
            absCopyNode.style.left =  coordinateByDivFreedom[0] + 'px';
            absCopyNode.style.top  = coordinateByDivFreedom[1] + 'px';
        }else 
        {
            elems.removeChild(absCopyNode); 
        }
    }
    
    console.log(e.target.id);
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
    console.log(e.target);
    if(isMoveElem(absCopyNode) && e.target && e.target.id !== 'box_freedom')
    {
        offset[1] += delta;
    }
}