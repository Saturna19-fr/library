const resultparag = document.getElementById("result");
const myHeaders = new Headers();
myHeaders.append("accept", "application/json");
myHeaders.append("Authorization", window.apikey);
const sc = null;
window.addEventListener('load', function () {
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserMultiFormatReader()
    console.log('ZXing code reader initialized')
    codeReader.listVideoInputDevices()
        .then((videoInputDevices) => {
            const sourceSelect = document.getElementById('sourceSelect')
            selectedDeviceId = videoInputDevices[0].deviceId
            if (videoInputDevices.length >= 1) {
                videoInputDevices.forEach((element) => {
                    const sourceOption = document.createElement('option')
                    sourceOption.text = element.label
                    sourceOption.value = element.deviceId
                    sourceSelect.appendChild(sourceOption)
                })

                sourceSelect.onchange = () => {
                    selectedDeviceId = sourceSelect.value;
                };
            }
            let debounce = false;
            window.searchManual = function(){
                let isbn = document.getElementById('isbn');
                searchItemByISBN(isbn.value, true);
                isbn.value = "";
            }

            function searchItemByISBN(ISBN, isManual = false) {
                if (debounce) return false;
                debounce = true;
                codeReader.reset()
                fetch("/api/addbook", {
                    method: 'POST',
                    headers: {
                        'ISBN': ISBN,
                    }
                })
                .then(response => response.json())
                .then(data => {
                    
                    if (data.status == 201) {
                        resultparag.innerHTML = "Livre ajouté correctement !";
                        alert("Le livre a été ajouté correctement !");
                        return startCamera();
                    } else if (data.status == 409) {
                        resultparag.innerHTML = "Le livre est déjà présent dans la base de données !";
                        alert("Le livre est déjà présent dans la base de données !");
                        return startCamera();
                    } else if (data.status == 500) {
                        resultparag.innerHTML = "Erreur interne !";
                        alert("Erreur interne !");
                        return startCamera();
                    } else if (data.status == 404) {
                        resultparag.innerHTML = "ISBN non trouvé !";
                        alert("ISBN non trouvé !");
                        return startCamera();
                    }
                })

            }

            // function searchItemByISBN(ISBN, isManual = false) {
                
            //     if (debounce) return false;
            //     debounce = true;
            //     codeReader.reset()
            //     fetch(window.baseurl + '/book/' + ISBN, { headers: myHeaders })
            //         //db281ba3800a48399ac5ba7de01f8763
            //         .then(response => response.json())
            //         .then(dataapi => {
            //             if (dataapi.errorMessage) {
            //                 resultparag.innerHTML = "Code-barres non reconnu err end isbn";
            //                 alert("Erreur ISBN (refaire le scan, sinon mettre de coté)")
            //                 return startCamera();
            //             }
            //             console.log(dataapi);
            //             if (dataapi.error) {
            //                 resultparag.innerHTML = "Code-barres non reconnu";
            //             } else {
            //                 if (isManual){
            //                     alert("Found !"+ dataapi.book.title_long)
            //                 }
            //                 resultparag.innerHTML = dataapi.book.title_long + " - " + dataapi.book.publisher;
            //                 addItem(dataapi.book.title_long, ISBN);
            //                 setTimeout(function () {
            //                     startCamera();
            //                 }, 2000);
            //             }
            //         })
            //         .catch((r) => {
            //             resultparag.innerHTML = "Erreur ! " + r;
            //             setTimeout(function () {
            //                 startCamera();
            //             }, 2000);
            
            //         })
            // }
            
            // function addItem(ISBN) {
            //     fetch(`/api/addbook`, {
            //         method: 'POST',
            //         headers: {
            //             'Title': TITLE,
            //             'ISBN': ISBN,
            //         }
            //     })
            //         .then(response => response.json())
            //         .then(data => {
            //             console.log(data);
            //             if (data.code == 400) {
            //                 resultparag.innerHTML = "Erreur flask !";
            //                 alert("Error flask !");
            //                 resultparag.innerHTML = `<strong>Erreur ! ${data.message}</strong>`;
            //             } else {
            //                 resultparag.innerHTML = "Ajouté !";
            //                 alert("Added ?")
            
            //             }
            //             setTimeout(function () {
            //                 startCamera();
            //             }, 2000);
            //         })
            // }

            // var alreadyScanned = [];
            document.getElementById('resetButton').addEventListener('click', () => {
                codeReader.reset()
                resultparag.textContent = '';
                console.log('Reset.')
            })
            function startCamera() {
                debounce = false;
                codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
                    if (result) {
                        console.log(result)
                        resultparag.textContent = result.text
                        if (result.text.length == 10 || result.text.length == 13) {
                            searchItemByISBN(result.text);
                        }
                    }
                    if (err && !(err instanceof ZXing.NotFoundException)) {
                        console.error(err)
                        resultparag.textContent = err
                    }
                })
                console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
            }
            setTimeout(function () {
                startCamera();
            }, 1000);

            document.getElementById('startButton').addEventListener('click', () => startCamera())
        })
        .catch((err) => {
            console.error(err)
        })
})






