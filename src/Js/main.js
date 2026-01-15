const polaroids = document.querySelectorAll(".polaroid");
const startDate = new Date("2025-08-06T14:30:00"); 
const fallingEmojis = ["✨", "💖", "💕", "🌸", "💫", "⭐"];
const eatSound = ["src/images/nomnomnom.mp3", "src/images/nom.mp3"];
const snakeHeadImg = new Image();
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("snake-start-btn");
const foodEmojis = ["🍓", "🍫", "🍕", "🍆"];
const gridSize = 30;

polaroids.forEach((card, i) => {
    const isMobile = window.innerWidth < 768;

    const maxOffset = isMobile
        ? window.innerWidth * 0.18
        : window.innerWidth * 0.3;

    const maxRotate = isMobile ? 6 : 10;

    const randomX = Math.random() * (maxOffset * 2) - maxOffset;
    const randomRotate = Math.random() * (maxRotate * 2) - maxRotate;

    card.style.transform = `translateX(${randomX}px) rotate(${randomRotate}deg)`;
});

function updateTimeTogether() {
    const now = new Date();
    let diff = now - startDate;

   
    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    let years = Math.floor(days / 365);
    days %= 365;

    let months = Math.floor(days / 30.4375);
    days = Math.floor(days % 30.4375);

    hours %= 24;
    minutes %= 60;
    seconds %= 60;

    document.getElementById("years").textContent = years.toString().padStart(2, "0");
    document.getElementById("months").textContent = months.toString().padStart(2, "0");
    document.getElementById("days").textContent = days.toString().padStart(2, "0");
    document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
}
// Update immediately, then every second
updateTimeTogether();
setInterval(updateTimeTogether, 1000);

function initScratchCard() {
    const canvas = document.querySelector(".scratch-canvas");
    const container = document.querySelector(".scratch-container");
    const photo = document.querySelector(".scratch-photo");
    const ctx = canvas.getContext("2d");

    function setupCanvas() {
        const width = photo.clientWidth;
        const height = photo.clientHeight;

        if (!width || !height) return;

        canvas.width = width;
        canvas.height = height;

        const scratchLayer = new Image();
        scratchLayer.src = "src/images/blankScreen2.png"; 

        scratchLayer.onload = () => {
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(scratchLayer, 0, 0, width, height);

            ctx.globalCompositeOperation = "destination-out";
        };
    }

    if (photo.complete) {
        setupCanvas();
    } else {
        photo.onload = setupCanvas;
    }

    let scratching = false;

    const particleLayer = document.createElement("div");
    particleLayer.style.position = "absolute";
    particleLayer.style.top = 0;
    particleLayer.style.left = 0;
    particleLayer.style.width = "100%";
    particleLayer.style.height = "100%";
    particleLayer.style.pointerEvents = "none";
    container.appendChild(particleLayer);

    function createParticles(x, y) {
        for (let i = 0; i < 3; i++) {
            const p = document.createElement("div");
            p.style.position = "absolute";
            p.style.width = "6px";
            p.style.height = "6px";
            p.style.background = "white";
            p.style.borderRadius = "50%";
            p.style.left = x + "px";
            p.style.top = y + "px";
            p.style.opacity = 1;

            particleLayer.appendChild(p);

            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 30;

            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;

            p.animate(
                [
                    { transform: `translate(0, 0)`, opacity: 1 },
                    { transform: `translate(${targetX - x}px, ${targetY - y}px)`, opacity: 0 }
                ],
                { duration: 600, easing: "ease-out" }
            ).onfinish = () => p.remove();
        }
    }

    function scratch(e) {
        if (!scratching) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        createParticles(x, y); 
        checkReveal();
    }

    function checkReveal() {
        const { width, height } = canvas;
        const pixels = ctx.getImageData(0, 0, width, height).data;

        let transparentPixels = 0;
        const totalPixels = width * height;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }

        const percent = (transparentPixels / totalPixels) * 100;

        if (percent >= 30) {
            canvas.style.transition = "opacity 2s ease";
            canvas.style.opacity = 0;
        }
    }

    canvas.addEventListener("mousedown", () => scratching = true);
    canvas.addEventListener("mouseup", () => scratching = false);
    canvas.addEventListener("mouseleave", () => scratching = false);
    canvas.addEventListener("mousemove", scratch);

    canvas.addEventListener("touchstart", () => scratching = true);
    canvas.addEventListener("touchend", () => scratching = false);
    canvas.addEventListener("touchmove", scratch);
}
window.addEventListener("load", initScratchCard);

function openLetter() {
    document.getElementById("letter-modal").classList.add("show");
}

function closeLetter() {
    document.getElementById("letter-modal").classList.remove("show");
}

function startCompatibility() {
    const name1Input = document.getElementById("name1");
    const name2Input = document.getElementById("name2");
    const loadingBar = document.getElementById("loading-bar");
    const loadingSection = document.getElementById("loading-section");
    const loadingMessage = document.getElementById("loading-message");
    const result = document.getElementById("result");

    if (!name1Input || !name2Input || !loadingBar || !loadingSection || !loadingMessage || !result) {
        console.error("One or more elements not found in the DOM.");
        return;
    }


    const name1 = document.getElementById("name1").value.trim(); 
    const name2 = document.getElementById("name2").value.trim();
    if (!name1 || !name2) {
        alert("Please enter both names!");
        return;
    }

    result.innerText = "";
    loadingBar.style.width = "0%";
    loadingSection.style.display = "block";
    loadingMessage.innerText = "";

    const messages = [
        "Calculating heart resonance...",
        "Analyzing romantic chemistry...",
        "Checking cosmic alignment...",
        "Consulting the love oracle...",
        "Finalizing compatibility score..."
    ];

    let progress = 0;
    let messageIndex = 0;

    const interval = setInterval(() => {
        progress += 5;
        loadingBar.style.width = progress + "%";

        if (progress >= (messageIndex + 1) * 20 && messageIndex < messages.length) {
            loadingMessage.innerText = messages[messageIndex];
            messageIndex++;
        }

        if (progress >= 100) {
            clearInterval(interval);
            loadingSection.style.display = "none";

            const theirName = name1.toLowerCase().trim();

            const isKatie =
                theirName === "katie" ||
                theirName === "kk80" ||
                theirName === "kt" ||
                theirName === "k80" ||
                theirName === "katie maskell";

            
            if (!isKatie) {
                result.innerHTML = `
                    Your Compatibility Score<br>
                    0%<br>
                    Not Compatible 💔
                `;
                return;
            }

        
            result.innerHTML = `
                Your Compatibility Score<br>
                96.67%<br>
                The Perfect Match of Bebes! 💖`;
            spawnHearts();

        }
    }, 200);
}

function spawnHearts() {
    const resultBox = document.getElementById("result");

    for (let i = 0; i < 8; i++) {
        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        heart.innerText = "❤️";

        heart.style.left = (Math.random() * 80 + 10) + "%";

        heart.style.animationDelay = (Math.random() * 0.5) + "s";

        resultBox.appendChild(heart);

        setTimeout(() => heart.remove(), 2000);
    }
}

function createFallingEmoji() {
    const emoji = document.createElement("div");
    emoji.classList.add("falling-emoji");


    emoji.textContent = fallingEmojis[Math.floor(Math.random() * fallingEmojis.length)];

    emoji.style.left = Math.random() * 100 + "vw";


    emoji.style.fontSize = (Math.random() * 12 + 18) + "px";

    emoji.style.animationDuration = (Math.random() * 3 + 4) + "s";

    document.body.appendChild(emoji);

    setTimeout(() => emoji.remove(), 7000);
}

setInterval(createFallingEmoji, 500);

// Snake 
snakeHeadImg.src = "src/images/snake_head.png";
let snake, direction, food, gameRunning;
function resetGame() {
    snake = [{ x: 150, y: 150 }];
    direction = { x: gridSize, y: 0 };
    food = spawnFood();
    gameRunning = true;
}

let currentFoodIndex = 0;
function spawnFood() {
    currentFoodIndex = Math.floor(Math.random() * foodEmojis.length);

    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

function drawSnake() {
    snake.forEach((part, index) => {
        if (index === 0) {
            // Draw head as PNG
            ctx.drawImage(snakeHeadImg, part.x, part.y, gridSize, gridSize);
        } else {
            // Draw body normally
            ctx.fillStyle = "#ff6a88";
            ctx.fillRect(part.x, part.y, gridSize, gridSize);
        }
    });
}

function drawFood() {
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const emoji = foodEmojis[currentFoodIndex];
    ctx.fillText(emoji, food.x + gridSize / 2, food.y + gridSize / 2);
}


function moveSnake() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        const randomSound = eatSound[Math.floor(Math.random() * eatSound.length)];

        const sfx = new Audio(randomSound);
        sfx.volume = 0.6;

        sfx.addEventListener("error", () => {
            console.error("Audio failed:", randomSound);
        });

        sfx.play().catch(err => console.error("Play error:", err));

        food = spawnFood();
    }

    else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height
    ) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

let lastFrameTime = 0;
const moveInterval = 120;

function gameLoop(timestamp) {
    if (!gameRunning) return;

    if (timestamp - lastFrameTime > moveInterval) {
        lastFrameTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        moveSnake();
        drawSnake();
        drawFood();

        if (checkCollision()) {
            gameRunning = false;
            startBtn.style.display = "block";
            startBtn.textContent = "Restart Game";
            return;
        }
    }

    requestAnimationFrame(gameLoop);
}

// Start btn
startBtn.addEventListener("click", () => {
    resetGame();
    startBtn.style.display = "none";
    gameLoop();
});

// Arrow key controls
document.addEventListener("keydown", e => {
    // Prevent page scrolling with arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -gridSize };
    if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: gridSize };
    if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -gridSize, y: 0 };
    if (e.key === "ArrowRight" && direction.x === 0) direction = { x: gridSize, y: 0 };
});

const secretSound = new Audio("src/images/ding.mp3");
secretSound.volume = 0.8;

function triggerSecretEvent() {
    secretSound.currentTime = 0;
    secretSound.play();

    const anim = document.getElementById("secret-animation");

    anim.style.opacity = "1";
    anim.style.transform = "translate(-50%, -50%) scale(1)";
    setTimeout(() => {
        anim.style.opacity = "0";
        anim.style.transform = "translate(-50%, -50%) scale(0.5)";
    }, 1000);

    setTimeout(() => {
        window.location.href = "https://www.youtube.com/watch?v=xRCziNW1Lc0";
    }, 1500);
}


let secretBuffer = "";
const secretPassword = "bebe";

document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        return;
    }

    secretBuffer += e.key.toLowerCase();

    if (secretBuffer.length > secretPassword.length) {
        secretBuffer = secretBuffer.slice(-secretPassword.length);
    }
    if (secretBuffer === secretPassword) {
        triggerSecretEvent();
    }
});


