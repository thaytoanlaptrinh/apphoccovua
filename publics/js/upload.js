
// const url = '/upload'
// async function upload(e) {
//     try {
//         const form = document.getElementById('form-avatar');
//         const data = new FormData(form);
//         console.log(data);
//         const response = await fetch(url, {
//             method: 'POST', // *GET, POST, PUT, DELETE, etc.
//             mode: 'cors', // no-cors, *cors, same-origin
//             cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//             credentials: 'same-origin', // include, *same-origin, omit
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//                 // 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             redirect: 'follow', // manual, *follow, error
//             referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//             body: data // body data type must match "Content-Type" header
//         });
//        console.log(response);

//     } catch (error) {
//         console.log(error);
//     }
// }

async function upload() {
    try {
        const form = document.getElementById('form-avatar');
        const data = new FormData(form);
        const res = await $.ajax({
            type: "POST",
            url: "/uploadcmt",
            data: data,
            processData: false,
            contentType: false
        });
    } catch (error) {
        console.log(error);
    }
}