const resultparag = document.getElementById("result");
const myHeaders = new Headers();
myHeaders.append("accept", "application/json");
myHeaders.append("Authorization", "55363_09fb2cee63ca1716ad3ddef13560636d");
// Quagga.init({
//     inputStream: {
//         name: "Live",
//         type: "LiveStream",
//         target: document.querySelector('#reader'), // Sélectionnez l'élément HTML où le flux vidéo sera affiché
//     },
//     decoder: {
//         readers: ["ean_reader", "ean_8_reader"],
//     },
//     debug: {
//         drawBoundingBox: true,
//         showFrequency: true,
//         drawScanline: true,
//         showPattern: true
//     }
// }, function (err) {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     Quagga.start();
// });
// Quagga.onDetected(function (data) {
//     console.log(data.codeResult.code); // Affiche le code-barres détecté dans la console
//     resultparag.innerHTML = data.codeResult.code; // Affiche le code-barres détecté sur la page
//     if (data.codeResult.code.length == 10 || data.codeResult.code.length == 13) {
//         Quagga.stop();
//     fetch('https://api2.isbndb.com/book/'+data.codeResult.code, {headers: myHeaders})
//         .then(response => response.json())
//         .then(dataapi => {
//             if (dataapi.errorMessage) {
//                 resultparag.innerHTML = "Code-barres non reconnu";
//                 return Quagga.start();
//             }
//             //db281ba3800a48399ac5ba7de01f8763
//             console.log(dataapi);
//             if (dataapi.error) {
//                 resultparag.innerHTML = "Code-barres non reconnu";
//             } else {
//                 resultparag.innerHTML = dataapi.book.title_long + " - " + dataapi.book.publisher;
//                 addItem(dataapi.book.title_long, data.codeResult.code);
//             }
//         })
//         .catch((r)=>{
//             resultparag.innerHTML = "Erreur ! "+r;
//         })
//     }
//     else {
//         resultparag.innerHTML = "Code-barres non reconnu";
//     }
// });
