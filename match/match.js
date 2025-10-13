const bg = document.getElementById('background');
const img = bg.querySelector('img');

bg.addEventListener('click', (event) => {
  const bgRect = bg.getBoundingClientRect();
  const clickX = event.clientX;
  const midpoint = bgRect.left + bgRect.width / 2;

  
  // Calculate the container's visible width
  const visibleWidth = bg.scrollWidth/7;

  if (clickX > midpoint) {
    // Clicked on right side → scroll right by container width
    console.log (visibleWidth)
    console.log (bgRect.width)
    bg.scrollBy({
      left: visibleWidth,
      behavior: 'smooth'
    });
  } else {
    // Clicked on left side → scroll left by container width
     
    bg.scrollBy({
      left: -visibleWidth,
      behavior: 'smooth'
    });
  }
});


// dot pairs and their overlays
const dotSequence = [
{ from: 1, to: 2, overlayId: 'bridgeoverlay', overlayDotClass: 'overlay_orangedot', dotColor: '#F6C943' },
{ from: 2, to: 3, overlayId: 'secondoverlay', overlayDotClass: 'overlay_greendot', dotColor: '#D3D848' },
{ from: 3, to: 4, overlayId: 'thirdoverlay', overlayDotClass: 'overlay_purpledotone', dotColor: '#DE74D8' },  
{ from: 4, to: 5, overlayId: 'fourthoverlay', overlayDotClass: 'overlay_yellowdot', dotColor: '#E89F57' },   
{ from: 5, to: 6, overlayId: 'fifthoverlay', overlayDotClass: 'overlay_pinkdot', dotColor: '#FFADD1' },
{ from: 6, to: 7, overlayId: 'sixthoverlay', overlayDotClass: 'overlay_purpledot', dotColor: '#DE74D8' },
{ from: 7, to: null, overlayId: 'seventhoverlay', overlayDotClass: 'overlay_greendottwo', dotColor: '#D3D848'}

];

const svgCanvas = document.getElementById('lineCanvas');
const dots = {
1: document.querySelector('.dot_1'),
2: document.querySelector('.dot_2'),
3: document.querySelector('.dot_3'),
4: document.querySelector('.dot_4'),
5: document.querySelector('.dot_5'),
6: document.querySelector('.dot_6'),
7: document.querySelector('.dot_7')
};

let overlayStates = {};
let lineStates = {};

// Initialize overlay states
dotSequence.forEach(step => {
overlayStates[step.overlayId] = false;
lineStates[`line_${step.from}_${step.to}`] = false;
});

// Hide all dots except dot_1 initially
Object.keys(dots).forEach(dotNum => {
if (dotNum !== '1') {
dots[dotNum].style.opacity = '0';
dots[dotNum].style.pointerEvents = 'none';
}
});

// Function to draw animated line between two dots
function drawLineBetweenDots(dot1, dot2, lineKey) {
const dot1Rect = dot1.getBoundingClientRect();
const dot2Rect = dot2.getBoundingClientRect();

const x1 = dot1Rect.left + dot1Rect.width / 2;
const y1 = dot1Rect.top + dot1Rect.height / 2;
const x2 = dot2Rect.left + dot2Rect.width / 2;
const y2 = dot2Rect.top + dot2Rect.height / 2;
// Create new SVG line element
const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
newLine.setAttribute('x1', x1);
newLine.setAttribute('y1', y1);
newLine.setAttribute('x2', x1);
newLine.setAttribute('y2', y1);
newLine.setAttribute('stroke', 'white');
newLine.setAttribute('stroke-width', '1');
newLine.setAttribute('opacity', '1');

svgCanvas.appendChild(newLine);

const duration = 1000;
const startTime = Date.now();

function animateLine() {
const elapsed = Date.now() - startTime;
const progress = Math.min(elapsed / duration, 1);

const easeProgress = progress < 0.5 
? 2 * progress * progress 
: 1 - Math.pow(-2 * progress + 2, 2) / 2;

const currentX = x1 + (x2 - x1) * easeProgress;
const currentY = y1 + (y2 - y1) * easeProgress;

newLine.setAttribute('x2', currentX);
newLine.setAttribute('y2', currentY);

if (progress < 1) {
requestAnimationFrame(animateLine);
} else {
lineStates[lineKey] = true;
}
}

animateLine();
}

// Function to reveal next dot
function revealNextDot(nextDotNum) {
const nextDot = dots[nextDotNum];
if (nextDot) {
nextDot.style.pointerEvents = 'auto';
nextDot.style.opacity = '1';
}
}

// Create event listeners for all dots dynamically
dotSequence.forEach(step => {
const currentDot = dots[step.from];
const overlay = document.getElementById(step.overlayId);
const overlayDot = overlay ? overlay.querySelector(`.${step.overlayDotClass}`) : null;

if (!currentDot) return;

currentDot.addEventListener('mouseenter', () => {
if (overlayStates[step.overlayId]) return;

overlayStates[step.overlayId] = true;
if (overlay) {
overlay.style.display = 'block';
overlay.style.opacity = '1';
}
if (overlayDot) {
overlayDot.style.opacity = '1';
}
});

currentDot.addEventListener('mouseleave', () => {
if (!overlayStates[step.overlayId]) return;
overlayStates[step.overlayId] = false;
if (overlay) {
overlay.style.opacity = '0';
}
if (overlayDot) {
overlayDot.style.opacity = '0';
}

setTimeout(() => {
if (overlay) {
overlay.style.display = 'none';
}

const lineKey = `line_${step.from}_${step.to}`;
if (!lineStates[lineKey]) {
drawLineBetweenDots(dots[step.from], dots[step.to], lineKey);
revealNextDot(step.to);
}
}, 400);
});
});


