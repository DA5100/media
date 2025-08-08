const doc = document;
const body = doc.body;

// make new loader
const loader = doc.createElement("div");
loader.id = "loader"; 
loader.classList.add("hidden");
body.appendChild(loader);
