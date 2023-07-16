const socket = io('http://localhost:3000/')
$('#div-chat').hide();
socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dangky').hide();
    arrUserInfo.forEach(user => {
        const { userName, id } = user;
        $('#ulUser').append(`<li id="${id}"> ${userName} </li>`)
    })

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { userName, id } = user;
        $('#ulUser').append(`<li id="${id}"> ${userName} </li>`)
    })

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    })
})


socket.on('DANG_KY_THAT_BAI', () => alert('Vui long chon user name khac'));

function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

openStream()
    .then(stream => playStream('localStream', stream));

var peer = new Peer();
peer.on('open', id => {
    document.getElementById('my-peer').append(id);
    $('#btnSignup').click(function () {
        const userName = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { userName, id })
    });
});

// Caller

$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
        });
});
// AnSwer
peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

$('#ulUser').on('click', 'li', function () {
    const id = $(this).attr('id');
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
        });
})