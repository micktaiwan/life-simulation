const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let cw = innerWidth - 400;
let ch = innerHeight;
canvas.width = cw;
canvas.height = ch;

let particles = [];
let red;
let green;
let white;
let blue;

window.onload = () => {
    main()
    setInput()
}

function main(GREEN, RED, WHITE, BLUE) {
    ctx.clearRect(0, 0, cw, ch)
    particles = []

    let greenNumber = GREEN || 200  
    let redNumber = RED || 200  
    let whiteNumber = WHITE || 200  
    let blueNumber = BLUE || 200  

    green = create(greenNumber, 'lime');
    red = create(redNumber, 'red');
    white = create(whiteNumber, 'white');
    blue = create(blueNumber, '#4242ff');

    animate();
}

function rules(config) {
    greenRule(green, config.g.g.force, config.g.g.radius)
    greenRule(red, config.g.r.force, config.g.r.radius)
    greenRule(white, config.g.w.force, config.g.w.radius)
    greenRule(blue, config.g.b.force, config.g.b.radius)

    redRule(red, config.r.r.force, config.r.r.radius)
    redRule(green, config.r.g.force, config.r.g.radius)
    redRule(white, config.r.w.force, config.r.w.radius)
    redRule(blue, config.r.b.force, config.r.b.radius)

    whiteRule(white, config.w.w.force, config.w.w.radius)
    whiteRule(red, config.w.r.force, config.w.r.radius)
    whiteRule(green, config.w.g.force, config.w.g.radius)
    whiteRule(blue, config.w.b.force, config.w.b.radius)

    blueRule(blue, config.b.b.force, config.b.b.radius)
    blueRule(red, config.b.r.force, config.b.r.radius)
    blueRule(white, config.b.w.force, config.b.w.radius)
    blueRule(green, config.b.g.force, config.b.g.radius)
}

function setInput() {
    let numbers = Array.from(document.querySelectorAll('.number'))
    numbers.forEach(input => {
        input.min = "0"
        input.max = "3000"
        input.value = "200"
        input.step = "1"
        input.addEventListener('change', reset)
    })

    let attraction = Array.from(document.querySelectorAll('.attraction'))
    attraction.forEach(input => {
        input.min = "-5"
        input.max = "5"
        input.value = "0"
        input.step = "0.05"
    })

    let radius = Array.from(document.querySelectorAll('.radius'))
    radius.forEach(input => {
        input.min = "10"
        input.max = "500"
        input.value = "180"
        input.step = "1"
    })

    let inputs = Array.from(document.querySelectorAll('input'))
    inputs.forEach(input => {
        input.addEventListener('change', updateRules)
    })

    document.getElementById('randomize').addEventListener('click', randomize);
}

function randomize() {
  const fmax = 2;
  document.getElementById('ggf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('grf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('gwf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('gbf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('rrf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('rgf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('rwf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('rbf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('wwf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('wrf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('wgf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('wbf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('bbf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('brf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('bwf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  document.getElementById('bgf').value = Math.round(-fmax*10 + Math.random() * fmax*20) / 10;
  const rmax = 500;
  document.getElementById('ggr').value = Math.round(Math.random() * rmax);
  document.getElementById('grr').value = Math.round(Math.random() * rmax);
  document.getElementById('gwr').value = Math.round(Math.random() * rmax);
  document.getElementById('gbr').value = Math.round(Math.random() * rmax);
  document.getElementById('rrr').value = Math.round(Math.random() * rmax);
  document.getElementById('rgr').value = Math.round(Math.random() * rmax);
  document.getElementById('rwr').value = Math.round(Math.random() * rmax);
  document.getElementById('rbr').value = Math.round(Math.random() * rmax);
  document.getElementById('wwr').value = Math.round(Math.random() * rmax);
  document.getElementById('wrr').value = Math.round(Math.random() * rmax);
  document.getElementById('wgr').value = Math.round(Math.random() * rmax);
  document.getElementById('wbr').value = Math.round(Math.random() * rmax);
  document.getElementById('bbr').value = Math.round(Math.random() * rmax);
  document.getElementById('brr').value = Math.round(Math.random() * rmax);
  document.getElementById('bwr').value = Math.round(Math.random() * rmax);
  document.getElementById('bgr').value = Math.round(Math.random() * rmax);
}

function animate() {
    update();
    draw();

    requestAnimationFrame(animate);
}

function update() {
    updateRules()
}

function reset() {
    let green = document.getElementById('green').children[1].children[0].value
    let red = document.getElementById('red').children[1].children[0].value
    let white = document.getElementById('white').children[1].children[0].value
    let blue = document.getElementById('blue').children[1].children[0].value
    
    main(green, red, white, blue)
}

function updateRules() {
    // update values
    let container = Array.from(document.getElementById('container').children)
    container.forEach(color => {
        let children = color.children
        for (let i = 1; i < children.length; i++) {
            let input = children[i].children[0]
            let value = children[i].children[1]
            value.textContent = input.value
        }
    })
    
    // update rules
    let config = {
        g: {
            g: {
                force: document.getElementById('ggf').value,
                radius: document.getElementById('ggr').value
            },
            r: {
                force: document.getElementById('grf').value,
                radius: document.getElementById('grr').value
            },
            w: {
                force: document.getElementById('gwf').value,
                radius: document.getElementById('gwr').value
            },
            b: {
                force: document.getElementById('gbf').value,
                radius: document.getElementById('gbr').value
            }
        },
        r: {
            g: {
                force: document.getElementById('rgf').value,
                radius: document.getElementById('rgr').value
            },
            r: {
                force: document.getElementById('rrf').value,
                radius: document.getElementById('rrr').value
            },
            w: {
                force: document.getElementById('rwf').value,
                radius: document.getElementById('rwr').value
            },
            b: {
                force: document.getElementById('rbf').value,
                radius: document.getElementById('rbr').value
            }
        },
        w: {
            g: {
                force: document.getElementById('wgf').value,
                radius: document.getElementById('wgr').value
            },
            r: {
                force: document.getElementById('wrf').value,
                radius: document.getElementById('wrr').value
            },
            w: {
                force: document.getElementById('wwf').value,
                radius: document.getElementById('wwr').value
            },
            b: {
                force: document.getElementById('wbf').value,
                radius: document.getElementById('wbr').value
            }
        },
        b: {
            g: {
                force: document.getElementById('bgf').value,
                radius: document.getElementById('bgr').value
            },
            r: {
                force: document.getElementById('brf').value,
                radius: document.getElementById('brr').value
            },
            w: {
                force: document.getElementById('bwf').value,
                radius: document.getElementById('bwr').value
            },
            b: {
                force: document.getElementById('bbf').value,
                radius: document.getElementById('bbr').value
            }
        }
    }

    rules(config)
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, ch);
    particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 3, 0, 2*Math.PI, false);
        ctx.fill()
    });
}

function create(number, color) {
    let group = [];
    for (let i = 0; i < number; i++) {
        group.push({ 'x': random().x, 'y': random().y, 'vx': 0, 'vy': 0, 's': 5, 'color': color });
        particles.push(group[i]);
    }
    return group;
}

function random() {
    return {
        x: Math.floor(Math.random() * cw),
        y: Math.floor(Math.random() * ch)
    }
}

function generalRule(group, particles, g, radius) {
  for (let i = 0; i < group.length; i++) {
    let fx = 0;
    let fy = 0;
    let a
    let b
    for (let j = 0; j < particles.length; j++) {
        a = group[i];
        b = particles[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0 && d < radius) {
            let F = g * 1 / d;
            fx += (F * dx);
            fy += (F * dy);
        }
    }
    a.vx = (a.vx + fx) * 0.5
    a.vy = (a.vy + fy) * 0.5
    a.x += a.vx;
    a.y += a.vy;
    if (a.x <= 0 || a.x >= cw) { a.vx *= -1 }
    if (a.x < 0 ) { a.x = 0 }
    if (a.x > cw) { a.x = cw }
    if (a.y <= 0 || a.y >= ch) { a.vy *= -1 }
    if (a.y < 0 ) { a.y = 0 }
    if (a.y > ch) { a.y = ch }
  }

}

function redRule(particles, g, radius) {
    generalRule(red, particles, g, radius)
}

function greenRule(particles, g, radius) {
    generalRule(green, particles, g, radius)
}

function whiteRule(particles, g, radius) {
    generalRule(white, particles, g, radius)
} 

function blueRule(particles, g, radius) {
    generalRule(blue, particles, g, radius)
}
