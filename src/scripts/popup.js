let url;
let firstLoad = true;

window.addEventListener("pageshow", function(event) {
  if(event.persisted || (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD)) {
    // If the page is loaded from the cache (back/forward navigation) or if the page was restored from the bfcache
    window.location.reload();
  }
  
});

function openPopup(title, content, type, redirectUrl = null, onLoad = null) {

  const style = document.createElement("style");
  style.textContent = `

  /* Overlay */
.popup {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Hidden by default */
.hidden {
  display: none;
}

/* Popup box */
.popup-content {
  background-color: #6b7280; /* Default: gray */
  border-radius: 8px;
  padding: 24px;
  width: 320px;
  color: white;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

/* Header */
.popup-header {
  margin-bottom: 12px;
}

#popup-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: white;
}

/* Message */
#popup-message {
  margin-bottom: 16px;
  color: white;
}

/* Actions */
.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Close button */
#close-btn {
  background-color: white;
  color: #1f2937; /* Dark text */
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

#close-btn:hover {
  background-color: #e5e7eb;
}

/* Popup type styles (optional, added dynamically) */
.popup-content.success {
  background-color: #10b981; /* Green */
}

.popup-content.error {
  background-color: #ef4444; /* Red */
}

.popup-content.info {
  background-color: #3b82f6; /* Blue */
}
`;
    document.head.append(style)
    const popup = document.createElement("div");
    popup.id = "popup";
    popup.className = "popup hidden";
    document.body.appendChild(popup);
    const popupContent = document.createElement("div");
    popupContent.id = "popup-content";
    popupContent.classList.add("popup-content");
    popup.appendChild(popupContent);
    const header = document.createElement("div");
    header.className = "popup-header";
    popupContent.appendChild(header);
    const titleElement = document.createElement("h2");
    titleElement.id = "popup-title";
    header.appendChild(titleElement);
    const messageElement = document.createElement("p");
    messageElement.setAttribute("id", "popup-message");
    popupContent.appendChild(messageElement);
    const actions = document.createElement("div");
    actions.className = "popup-actions";
    popupContent.appendChild(actions);
    const closeButton = document.createElement("button");
    closeButton.id = "close-btn";
    closeButton.textContent = "Close";
    closeButton.setAttribute("onclick", "closePopup()");
    actions.appendChild(closeButton);

    // Reset classes
  popupContent.className = "popup-content";

  // Add type class
  switch (type) {
    case "success":
    case "error":
    case "info":
      popupContent.classList.add(type);
      break;
    default:
      // Leave as default gray
      break;
  }

  titleElement.textContent = title;
  messageElement.textContent = content;

  url = redirectUrl;
  popup.classList.remove("hidden");
  firstLoad = false;
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("hidden");
  if (url) {
    window.location.href = url;
  }
}

