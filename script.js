let stepCount = 0;
let isRunning = false;
let threshold = 12; // Adjust after testing

const stepDisplay = document.getElementById("stepCount");
const distanceDisplay = document.getElementById("distance");
const caloriesDisplay = document.getElementById("calories");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// Assumptions
const stepLength = 0.78; // meters
const caloriesPerStep = 0.04; // kcal

// Start pedometer
startBtn.addEventListener("click", () => {
  if (!isRunning) {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      // iOS requires permission
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === "granted") {
            window.addEventListener("devicemotion", trackSteps);
            isRunning = true;
            startBtn.innerText = "Stop";
          }
        })
        .catch(console.error);
    } else {
      // Android
      window.addEventListener("devicemotion", trackSteps);
      isRunning = true;
      startBtn.innerText = "Stop";
    }
  } else {
    window.removeEventListener("devicemotion", trackSteps);
    isRunning = false;
    startBtn.innerText = "Start";
  }
});

// Reset steps
resetBtn.addEventListener("click", () => {
  stepCount = 0;
  updateStats();
});

// Track steps using accelerometer
function trackSteps(event) {
  let acc = event.accelerationIncludingGravity;

  if (!acc) return;

  let totalAcc = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);

  if (totalAcc > threshold) {
    stepCount++;
    updateStats();
  }
}

// Update stats on screen
function updateStats() {
  stepDisplay.innerText = stepCount;

  let distance = (stepCount * stepLength) / 1000; // km
  let calories = stepCount * caloriesPerStep;

  distanceDisplay.innerText = distance.toFixed(2);
  caloriesDisplay.innerText = calories.toFixed(2);
}
