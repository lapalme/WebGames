export {svg,isSafari,makePoints,pts,
        M,L,Q,C,S,T,A, circleWithArcs,
        rotate,translate,scale,scaleAt,
        getTranslateInfos,translateSVG,translateSVG_rel,
        getRotateInfos,rotateSVG,rotateSVG_rel,animateTransform,cText,getPos,
        setSVGfactors,svg_drag}

// some filters do not work in Safari, although setting them in CSS sometimes work!!
//  use this type of test when necessary
//  e.g. {...,filter:isSafari()?"none":"url(#filter)"...}
function isSafari(){
    // Source - https://stackoverflow.com/a/49873971
    // Posted by goediaz, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-02-16, License - CC BY-SA 3.0
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

// using jQuery to create an SVG element in the appropriate namespace
//  attrs: an object whose keys are attribute names and values the corresponding values
//  body: other svg elements
function svg(tagName,attrs,...body){
    var $e = $(document.createElementNS('http://www.w3.org/2000/svg',tagName));
    if(arguments.length>1){
        $e.attr(attrs);
        if(body!=null)$e.append(body);
    }
    return $e;
}

// to simplify string creation of points for <polygon>
// a list of points [x0,y0,....xn,yn]
function makePoints(points){
    let xys = [];
    for (let i=0;i<points.length;i+=2){
        xys.push(`${points[i]},${points[i+1]}`)
    }
    return xys.join(" ")
}

// using [x0,y0],...,[xn,yn] as parameters...
function pts(...points){
    return points.map(([x,y])=>`${x},${y}`).join(" ")
}

// simplify creating strings for <path>
function M(x,y){return ` M ${x},${y}`}
function L(x,y){return ` L ${x},${y}`}
function Q(cx,cy,x,y){return ` Q ${cx},${cy} ${x},${y}`}
function C(cx0,cy0,cx1,cy1,x,y){return ` C ${cx0},${cy0} ${cx1},${cy1} ${x},${y}`}
function A(rx,ry,xar,laf,sf,x,y){return ` A ${rx},${ry} ${xar} ${laf} ${sf} ${x},${y}`}
function S(cx1,cy1,x,y){return `S ${cx1},${cy1} ${x},${y}`}
function T(x,y){return ` T ${x},${y}`}

// adapted from https://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
// for SVG create a circle with two arcs to embed in a path
// used to create a "hole" in the piece...
function circleWithArcs(cx,cy,r){
    return `M ${cx},${cy} m ${r},0 a ${r},${r} 0 1,0 -${r*2},0 a ${r},${r} 0 1,0  ${r*2},0`
}

// for transform:
const ori2rot = {"↑":0,"→":90,"↓":180,"←":270,"N":0,"E":90,"S":180,"W":270}
function rotate(angle,x,y){ // either an angle or an orientation
    if (angle in ori2rot) angle=ori2rot[angle];
    return ` rotate(${angle},${x},${y})`
}
function translate(x,y){return ` translate(${x},${y})`}
function scale(sx,sy=sx){return ` scale(${sx},${sy})`}
// scale from a point using the "translate sandwich"
function scaleAt(sx,sy,ox,oy){return translate(ox,oy)+scale(sx,sy)+translate(-ox,-oy)}


function getTranslateInfos(svg_elem){
    // takes for granted that components are separated by a comma or a space
    const transformS = (svg_elem.attr("transform") || "").trim();
    if (transformS=="") return null;
    const m = /translate\((.*?)[, ](.*?)\)/.exec(transformS)
    if (m!=null){
        return {transformS:transformS,translateS:m[0], x:parseFloat(m[1]), y:parseFloat(m[2])}
    }
    return {transformS:transformS};
}

// update a transform when there can be more than one component, in the case of a single transform
// it is simpler to replace it altogether with $("#id").attr("transform",....)
// translation
function translateSVG(svg_elem,x,y){
    const infos=getTranslateInfos(svg_elem);
    if (infos==null){
        svg_elem.attr("transform",translate(x,y))
    } else if (infos.translateS !== undefined) {
        svg_elem.attr("transform",infos.transformS.replace(infos.translateS,translate(x,y)))
    } else 
        svg_elem.attr("transform",infos.transformS+translate(x,y))
    return svg_elem;
}

// translation by dx,dy 
function translateSVG_rel(svg_elem,dx,dy){
    const infos=getTranslateInfos(svg_elem);
    if (infos==null){
        svg_elem.attr("transform",translate(dx,dy))
    } else if (infos.translateS !== undefined) {
        svg_elem.attr("transform",infos.transformS.replace(infos.translateS,translate(infos.x+dx,infos.y+dy)))
    } else 
        svg_elem.attr("transform",infos.transformS+translate(dx,dy))
    
    return svg_elem
}

function getRotateInfos(svg_elem){
    // takes for granted that components are separated by a comma or a space
    const transformS = (svg_elem.attr("transform") || "").trim();
    if (transformS=="") return null;
    const m = /rotate\((.*?)[, ](.*?)[, ](.*?)\)/.exec(transformS)
    if (m!=null){
        return {transformS:transformS,rotateS:m[0], angle: parseFloat(m[1]), x:parseFloat(m[2]), y:parseFloat(m[3])}
    }
    return {transformS:transformS};
}

// rotation
function rotateSVG(svg_elem,angle,x,y){
    const infos=getRotateInfos(svg_elem);
    if (infos==null){
        svg_elem.attr("transform",rotate(angle,x,y))
    } else if (infos.rotateS !== undefined) {
        svg_elem.attr("transform",infos.transformS.replace(infos.rotateS,rotate(angle,x,y)))
    } else 
        svg_elem.attr("transform",infos.transformS+rotate(angle,x,y))
    return svg_elem;
}

// add an angle
function rotateSVG_rel(svg_elem,dangle,x,y){
    const infos=getRotateInfos(svg_elem);
    if (infos==null){
        svg_elem.attr("transform",rotate(dangle,x,y))
    } else if (infos.transformS !== undefined) {
        svg_elem.attr("transform",infos.transformS.replace(infos.rotateS,rotate((infos.angle+dangle)%360,infos.x,infos.y)))
    } else 
        svg_elem.attr("transform",infos.transformS+rotate(dangle,x,y))
    return svg_elem;
}

// animation "from" tp "to" on "dur" seconds
// the object stays at the start, 
// animation must be launched explicitely with <element>.beginElement()
// many animations can be launched in parallel, because of additive:"sum"
/*  example of use for translating from oldI,oldJ to newI,newI during 2 seconds
    // remove any old animations
    $(".animate").remove()  
    // install animation
    x.drawing.append(
        animateTransform("translate",oldJ+" "+oldI,newJ+" "+newI,2)
            .on("endEvent",function(e){
                $(this).parent().attr("transform",translate(newJ,newI))
            })
    )
    // launch all animations
    $(".animate",x.drawing).each(function(idx){this.beginElement()})
*/
function animateTransform(type,from,to,dur=1,fill="freeze"){
    // console.log(`animateTransform(${type},${from},${to})`)
    return svg("animateTransform",
                {attributeName:"transform",attributeType:"XML",
                 class:"animate", // utile pour enlever les animations une fois terminées
                 type:type,from:from,to:to,dur:dur+'s', 
                 additive:"sum",
                 fill:fill,
                 begin:"indefinite"
                 })
}

// display a centered text at x,y
function cText(text,x,y,fill="black",fsize="0.2"){
    return svg("text",{x:x,y:y,
                       "text-anchor":"middle",
                       "dominant-baseline":"central", "alignment-baseline":"middle",
                       "stroke":"black","stroke-width":0.01,
                       "font-family":"sans-serif","font-size":fsize,fill:fill},
                text)
}

// adapted from https://gist.github.com/Nonagod/586d0070d3370988d3a0aded474c37d8
// get a sizes and position of svg element, relative browser viewport (page piece, showed on a screen, which we can see)
let svg_position, svg_sizes_factor,svg_baseval ; // set in setSVGFactors which should be called at the start or on resizing the window

function getCoord({x,y}){ // transformer des coordonnées d'écran en unités svg
    return [(x - svg_position.x) * svg_sizes_factor.x + svg_baseval.x,
            (y - svg_position.y) * svg_sizes_factor.y + svg_baseval.y]
}

function getPos(e){
    return getCoord({x:e.clientX,y:e.clientY})
}

function setSVGfactors(){
    const $svg_element = $("#svg_element");
    svg_position = $svg_element[0].getBoundingClientRect();
    svg_baseval  = $svg_element[0].viewBox.baseVal;
    const svg_width    = $svg_element.width();
    const svg_height   = $svg_element.height();
    // difference coefficients between HTML element and svg viewbox sizes.
    svg_sizes_factor = {
        x: svg_baseval.width / svg_width,
        y: svg_baseval.height / svg_height
    };
}

////   exploratory abstraction to try to simplify the dragging of objects....
// drag a drawing of an object within an SVG_element
// with the mouse at from [x,y] 
// If the release is at one of the possibleIJ (the one with index idx)
//   then perform action(idx,newI,newJ)
//   else reset the object to its original place
// When possibleIJ is null then call action(x,y) without any rounding or truncation
function svg_drag(drawing,object,svg_element,from,possibleIJ,action){
    if (drawing == null)return;
    let [xPrev,yPrev] = from;
    
    // déplacer l'élément à la fin pour qu'il apparaisse sur le dessus quand on le bouge
    drawing.parent().append(drawing);
    svg_element.on("pointermove",pointermove);
    svg_element.on("pointerup",pointerup);
    
    // gérer le drag en calculant le décalage par rapport à la valeur précédente
    // HACK: le déplacement relatif est important pour ne pas à avoir à tenir compte 
    //        du décalage par rapport à la souris....
    function pointermove(e){
        if (drawing == null)return;
        const [x,y]=getPos(e);
        // console.log("pointermove",x-xPrev,y-yPrev)
        if (x==xPrev && y==yPrev) return;
        // pointerdownTime=null;
        translateSVG_rel(drawing,x-xPrev,y-yPrev);
        // $current.attr("transform",translate(piece.j+x-xOrig,piece.i+y-yOrig));
        xPrev=x;
        yPrev=y;
    }

    function pointerup(e){
        if (possibleIJ==null){
            action(xPrev,yPrev)
        } else {
            const newI = Math.trunc(yPrev), newJ=Math.trunc(xPrev);
            // console.log("pointerup",yPrev,newI,xPrev,newJ);
            // console.log("possibleIJ",possibleIJ.join(", "))
            const idx = possibleIJ.findIndex(([i,j])=>i==newI && j==newJ)
            if (idx>=0){
                translateSVG(drawing,newJ,newI);
                action(idx,newI,newJ)
            } else {
                // remettre à la place originale
                translateSVG(drawing,object.j,object.i);
            }
        }
        svg_element.off("pointermove");
        svg_element.off("pointerup")    
    }
}

// intersection between two circles 
// adapted from the Python code at
// https://stackoverflow.com/questions/55816902/finding-the-intersection-of-two-circles
// once thought to be useful, but finally not needed (kept here in case...)
function intersection(x0, y0, r0, x1, y1, r1){
    // circle 1: (x0, y0), radius r0
    // circle 2: (x1, y1), radius r1
    const d=Math.sqrt((x1-x0)**2 + (y1-y0)**2)
    // // non intersecting
    if (d > r0 + r1)return null
    // One circle within other
    if (d < Math.abs(r0-r1))return null
    // coincident circles
    if (d == 0 && r0 == r1) return null
    
    const a=(r0**2-r1**2+d**2)/(2*d)
    const h=Math.sqrt(r0**2-a**2)
    const x2=x0+a*(x1-x0)/d   
    const y2=y0+a*(y1-y0)/d   
    const x3=x2+h*(y1-y0)/d     
    const y3=y2-h*(x1-x0)/d 
    const x4=x2-h*(y1-y0)/d
    const y4=y2+h*(x1-x0)/d    
    return [x3, y3, x4, y4]
}
