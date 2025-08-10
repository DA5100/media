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


document.addEventListener("DOMContentLoaded", async function(){
    auth.onAuthStateChanged(async (user) => {
    const currentUser = auth.currentUser;
    const userUID =  user.uid

    function isValidFormat(str) {
        const regex = /^[A-Za-z0-9]{5}[A-Za-z0-9]{5}$/;
        return regex.test(str);
    }

    let serialKey = await getItem(user.uid, "serial_keys", "serial");
    let userToken = await getItem(user.uid, "jwt", "jwt");

    console.log("Serial Key: " + serialKey);
    console.log("User Token: " + userToken);

    if (!user) {
        openPopup("Error", "Anda belum login. Silakan login terlebih dahulu untuk melanjutkan.", "error", "https://da5100.github.io/auth/");
        // window.location.href = "https://da5100.github.io/auth/";
        return;
    } else {
        console.log("User is logged in:", user.displayName); 

       if (!serialKey) {
            openPopup("Error", "Serial key tidak ditemukan. Silakan masukkan serial key yang valid.", "error", "https://da5100.github.io/auth/");
            return;

        } else {

        const keyRef = db.collection("lisensi").doc(serialKey);
        console.log("Serial Key: " + serialKey);
        console.log("User Token: " + userToken);
        
        let serialKey = await getItem(user.uid, "serial_keys", "serial");
        let userToken = await getItem(user.uid, "jwt", "jwt");

        console.log("Serial Key: " + serialKey);
        console.log("User Token: " + userToken);

        keyRef.get().then(async (doc) => {
            let getData = doc.data();
            const emailDatamd5 = CryptoJS.MD5(getData.email).toString();

            if(!userToken || !doc.exists) {
                openPopup("Error", "User Token tidak ada!", "error", "https://da5100.github.io/auth/");
                window.location.href = "https://da5100.github.io/auth/"
            } else if (!serialKey) {
                openPopup("Error", "Serial key tidak ditemukan. Silakan masukkan serial key yang valid.", "error", "https://da5100.github.io/auth/");
                window.location.href = "https://da5100.github.io/auth/"
            } else {
                console.log("Email: " + getData.email + " valid!, jwt: " + userToken);
            }
        });
        }
    }

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

        req.onsuccess = () => {
            const result = req.result ? req.result[valueName] : null;
            resolve(result);
        };
        req.onerror = () => reject(req.error);
    });
}
    
});
})
