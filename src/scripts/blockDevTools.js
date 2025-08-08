let devtoolsDetected = false;
const threshold = 160; // ms pause threshold
const checkInterval = 1000; // check every 1 sec
const samples = 3; // number of samples to average
let durations = [];

function checkDevTools() {
  const start = performance.now();

  debugger; // will pause if DevTools open

  const duration = performance.now() - start;
  durations.push(duration);

  // Keep only last N samples
  if (durations.length > samples) durations.shift();

  // Calculate average duration
  const avgDuration = durations.reduce((a,b) => a + b, 0) / durations.length;

  if (avgDuration > threshold && !devtoolsDetected) {
    devtoolsDetected = true;
    onDevToolsDetected();
  } else if (avgDuration <= threshold && devtoolsDetected) {
    // DevTools closed or paused no longer detected
    devtoolsDetected = false;
    onDevToolsClosed();
  }
}

function onDevToolsDetected() {
  // Show a single alert or custom modal
  alert("Developer tools detected. Please close them.");

  // Redirect after delay to allow user to read alert
  setTimeout(() => {
    window.location.href = "about:blank";
  }, 1000);

  // Optional: attempt to close tab (may not work in all browsers)
  setTimeout(() => {
    window.close();
  }, 1500);
}

function onDevToolsClosed() {
  console.log("DevTools closed");
  // Optionally reset UI or flags
}

// Start the periodic check
setInterval(checkDevTools, checkInterval);
