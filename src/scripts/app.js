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
const params = new URLSearchParams(window.location.search);
const userToken = params.get("session");
const serialKey = params.get("serial_key");

document.addEventListener("DOMContentLoaded", function(){
    auth.onAuthStateChanged((user) => {
    const currentUser = auth.currentUser;
    function isValidFormat(str) {
        const regex = /^[A-Za-z0-9]{5}[A-Za-z0-9]{5}$/;
        return regex.test(str);
    }
    if (!currentUser) {
        openPopup("Error", "Anda belum login. Silakan login terlebih dahulu untuk melanjutkan.", "error", "https://da5100.github.io/auth/");
        // window.location.href = "https://da5100.github.io/auth/";
        return;
    } else if (!isValidFormat(serialKey)){
        openPopup("Error", "Serial Key tidak sesuai format", "error", "https://da5100.github.io/auth/");
    } else {
        console.log("User is logged in:", user.displayName); 
    
        const email = String(user.email);
        const emailmd5 = CryptoJS.MD5(email).toString();

       if (!serialKey) {
            openPopup("Error", "Serial key tidak ditemukan. Silakan masukkan serial key yang valid.", "error", "https://da5100.github.io/auth/");
            return;
        } else {
        const keyRef = db.collection("lisensi").doc(serialKey);
        keyRef.get().then((doc) => {
        let getData = doc.data();
        const emailDatamd5 = CryptoJS.MD5(getData.email).toString();

        if(!userToken || !doc.exists) {
            openPopup("Error", "User Token tidak ada!", "error", "https://da5100.github.io/auth/");
            window.location.href = "https://da5100.github.io/auth/"
        } else if (!serialKey) {
            openPopup("Error", "Serial key tidak ditemukan. Silakan masukkan serial key yang valid.", "error", "https://da5100.github.io/auth/");
            window.location.href = "https://da5100.github.io/auth/"
        }else if(emailDatamd5 !== emailmd5){
            openPopup("Error", "Sesi tidak sah! Coba login kembali menggunakan akun yang terdaftar!", "error", "https://da5100.github.io/auth/");
            window.location.href = "https://da5100.github.io/auth/"
        } else {
            console.log("Email: " + getData.email + " valid!, md5: " + emailDatamd5 + " | " + emailmd5);
        }
    });
        }
    }
    
    
});
})
