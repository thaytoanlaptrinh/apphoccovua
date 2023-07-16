const socket = io('/');

const userNameLogin = document.getElementById('username').innerText;

// window.addEventListener('blur', () => {
//   document.title = 'Đang chơi không tập trung';
//   socket.emit('cheating', `${userNameLogin}`);
// });

// window.addEventListener('focus', () => {
//   document.title = 'Đang làm bài tập';
// });

socket.emit('DANG_KY_USER', userNameLogin)

socket.on('DANH_SACH_ONLINE', (arrUserInfo) => {
  arrUserInfo.forEach((user) => {
    const { userName, id } = user;
    if (userName === userNameLogin) {
    } else {
      $('#ulUser').append(
        `<li id="${id}">Bạn có muốn trò chuyện với ${userName} </li>`
      );
    }
  });

  socket.on('CO_NGUOI_DUNG_MOI', (user) => {
    const { userName, id } = user;
    $('#ulUser').append(
      `<li id="${id}">Bạn có muốn trò chuyện với ${userName} ? </li>`
    );
  });

  socket.on('AI_DO_NGAT_KET_NOI', (peerId) => {
    $(`#${peerId}`).remove();
  });
});
