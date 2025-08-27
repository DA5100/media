const firebaseConfig = {
    apiKey: "AIzaSyCBeFJtPKEMURY-iUDUR4I6gWKjmlTk_3E",
    authDomain: "authdramaarena.firebaseapp.com",     
    databaseURL: "https://authdramaarena.firebaseio.com",
    projectId: "authdramaarena",                      
    storageBucket: "authdramaarena.appspot.com",      
    messagingSenderId: "348583435302",             
    appId: "1:348583435302:web:someUniqueWebId",    
    measurementId: "G-DGF0CP099H"                  
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ===== IndexedDB Helper =====
async function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("auth", 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("serial_keys")) {
                db.createObjectStore("serial_keys", { keyPath: "uid" });
            }
            if (!db.objectStoreNames.contains("jwt")) {
                db.createObjectStore("jwt", { keyPath: "uid" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function setItem(key, value, storeName, valueName = "serial") {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const objectStore = tx.objectStore(storeName);
        const req = objectStore.put({ uid: key, [valueName]: value });
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
    });
}

async function getItem(key, storeName, valueName = "serial") {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const objectStore = tx.objectStore(storeName);
        const req = objectStore.get(key);
        req.onsuccess = () => resolve(req.result?.[valueName] ?? null);
        req.onerror = () => reject(req.error);
    });
}

// ====== Auth Check ======
document.addEventListener("DOMContentLoaded", function(){
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            openPopup("Error", "Anda belum login.", "error", "https://da5100.github.io/auth/");
            return;
        }

        console.log("User logged in:", user.displayName);

        let serialKey = await getItem(user.uid, "serial_keys", "serial");
        let userToken = await getItem(user.uid, "jwt", "jwt");

        if (!serialKey) {
            openPopup("Error", "Serial key tidak ditemukan.", "error", "https://da5100.github.io/auth/");
            return;
        }

        const keyRef = db.collection("lisensi").doc(serialKey);
        keyRef.get().then((doc) => {
            if (!doc.exists) {
                openPopup("Error", "Lisensi tidak ditemukan!", "error", "https://da5100.github.io/auth/");
                return;
            }

            const getData = doc.data();
            const emailDatamd5 = CryptoJS.MD5(getData.email).toString();

            if (!userToken) {
                openPopup("Error", "User Token tidak ada!", "error", "https://da5100.github.io/auth/");
                return;
            }

            console.log("Email:", getData.email, "jwt:", userToken);
        });
    });
});
