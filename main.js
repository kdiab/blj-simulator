// Initialize canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize audio files
const audio146 = new Audio("sounds/146.wav");
const audio148 = new Audio("sounds/148.wav");
let currentAudio = audio146;
let isMuted = false;

// Initialize variables
let FPSCounter = 1;
let color = "black";
let clickTime = 0;
let displayedFrames = [];
let fpsCounting = false;
const frameNumberSpacing = 100;
const targetFrameRate = 30;
const frameTime = 1 / targetFrameRate;
let previousFrameTime = Date.now();
let consecutiveRoute146 = false;
let pressed6After14 = false;
let consecutiveRoute148 = false;
let pressed8After14 = false;

let gamepadConnected = false;
let previousAButtonState = false;

// Run the game loop
function gameLoop() {
    handleEvents();
    update();
    render();

    // Schedule the next frame with requestAnimationFrame
    requestAnimationFrame(gameLoop);
}

// Handle keyboard and gamepad events
function handleEvents() {
    // Keyboard events
    document.addEventListener("keydown", (event) => {
        handleKeyEvent(event.key);
    });

    // Gamepad events
    window.addEventListener("gamepadconnected", (event) => {
        console.log("Gamepad connected");
        gamepadConnected = true;
    });

    window.addEventListener("gamepaddisconnected", (event) => {
        console.log("Gamepad disconnected");
        gamepadConnected = false;
    });

    // Check for gamepad button press
    if (gamepadConnected) {
        const gamepad = navigator.getGamepads()[0];

        // Check for 'A' button release (button 0)
        const currentAButtonState = gamepad && gamepad.buttons[0].pressed;
        if (!currentAButtonState && previousAButtonState) {
            handleKeyEvent('A');
        }

        // Update the previous state
        previousAButtonState = currentAButtonState;
    }
}

function handleKeyEvent(key) {
    if (key === "1" || key === "4" || (consecutiveRoute146 && key === "6") || (consecutiveRoute148 && key === "8")) {
        color = "green";
    } else {
        color = "red";
    }

    // Check if the frame is already in the displayedFrames array
    if (FPSCounter <= 13 && !displayedFrames.includes(FPSCounter)) {
        displayedFrames.push(FPSCounter);
    }

    if (!fpsCounting) {
        fpsCounting = true;
        if (!isMuted) {
            currentAudio.play();
        }
    }

    if (FPSCounter === 1) {
        consecutiveRoute146 = false;
        pressed6After14 = false;
        consecutiveRoute148 = false;
        pressed8After14 = false;
    } else if (FPSCounter === 4) {
        consecutiveRoute146 = false;
        pressed6After14 = false;
        consecutiveRoute148 = false;
        pressed8After14 = false;
    } else if (FPSCounter === 6) {
        consecutiveRoute146 = true;
        pressed6After14 = true;
        consecutiveRoute148 = false;
        pressed8After14 = false;
    } else if (FPSCounter === 8) {
        consecutiveRoute148 = true;
        pressed8After14 = true;
    } else {
        pressed6After14 = false;
        pressed8After14 = false;
    }

    clickTime = performance.now();
}

// Render to canvas
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the FPS counter in the top-left corner
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("FPS: " + FPSCounter, 10, 20);

    // Draw the frame numbers until frame 13
    ctx.font = "36px Arial";
    for (let i = 0; i < displayedFrames.length; i++) {
        const frame = displayedFrames[i];
        const totalWidth = displayedFrames.length * frameNumberSpacing;
        const startX = (canvas.width - totalWidth) / 2;
        const frameX = startX + i * frameNumberSpacing;
        const frameY = canvas.height / 2 + 18; // Adjusted for better alignment

        const frameColor = (frame === 1 || frame === 4 || (consecutiveRoute146 && frame >= 6) || (consecutiveRoute148 && frame >= 8)) ? "green" : "red";

        ctx.fillStyle = frameColor;
        ctx.fillText(frame.toString(), frameX, frameY);
    }

    // Draw the mute button
    ctx.fillStyle = "blue";
    ctx.fillRect(canvas.width - 50, 10, 40, 20);
    ctx.fillStyle = "white";
    ctx.fillText(isMuted ? "Unmute" : "Mute", canvas.width - 150, 25);

    // Display audio state
    let timing = currentAudio === audio146 ? "1 4 6" : "1 4 8";
    ctx.fillText(`Timing: ${timing} (Press T to toggle)`, canvas.width - 520, 75);
}

// Update the game state
function update() {
    const currentTime = Date.now();
    if (currentTime - previousFrameTime >= frameTime * 1000) {
        // If the FPS counter is counting frames, increment the FPS Counter
        if (fpsCounting) {
            FPSCounter += 1;

            // If the FPS Counter reaches 30, reset it to 1 and stop counting FPS
            if (FPSCounter > 30) {
                FPSCounter = 1;
                fpsCounting = false;

                // Reset the displayed frame numbers list
                displayedFrames = [];
            }
        }

        previousFrameTime = currentTime;
    }
}

// Mute button click event
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if the click is within the mute button area
    if (x >= canvas.width - 50 && x <= canvas.width - 10 && y >= 10 && y <= 30) {
        isMuted = !isMuted;
        if (isMuted) {
            currentAudio.pause();
        } else {
            currentAudio.play();
        }
    }
});

// Toggle between audio files when 'T' key is pressed
document.addEventListener("keydown", (event) => {
    if (event.key === "T" || event.key === "t") {
        if (currentAudio === audio146) {
            currentAudio = audio148;
        } else {
            currentAudio = audio146;
        }
        // If not muted, play the new audio file
        if (!isMuted) {
            currentAudio.play();
        }
    }
});

// Start the game loop
gameLoop();

