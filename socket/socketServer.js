const socketIO = require('socket.io');
const { messageError } = require('./../until/eventLog');
const { PuzzleModal } = require('../models/PGN');

module.exports = (server) => {
  let count = 0;
  const arrUserInfo = [];
  const io = socketIO(server);
  const listScore = [];

  function handleScore(obj) {
    if (listScore.length == 0) {
      listScore.push(obj);
      return;
    }
    for (let i = 0; i < listScore.length; i++) {
      if (listScore[i].userNameLogin === obj.userNameLogin) {
        listScore[i].number = listScore[i].number + obj.number;
        return;
      }
    }
    listScore.push(obj);
  }

  io.on('connection', (socket) => {
    socket.on('NGUOI_DUNG_DANG_KY', (user) => {
      const isExist = arrUserInfo.some((e) => e.userName === user.userName);
      socket.peerId = user.id;
      if (isExist) {
        return socket.emit('DANG_KY_THAT_BAI');
      }
      arrUserInfo.push(user);
      socket.emit('DANH_SACH_ONLINE', arrUserInfo);
      socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
    });

    socket.on('cheating', (data) => {
      messageError(`'${data}': Đang chơi không tập trung ${++count} `);
    });
    socket.on('LOAD_PGN', async (data) => {
      const status = await PuzzleModal.create({ puzzle: data });
      console.log(status);
      socket.broadcast.emit('SEVER_LOAD_PGN', data);
    });
    socket.on('DANG_KY_USER', async (user) => {
      // const keyString = user;
      // const value = 0;
      const obj = { userNameLogin: user, number: 0 };
      // obj[keyString] = value;
      const isExistUser = listScore.filter((e) => {
        return e.userNameLogin === user;
      });
      if (!isExistUser.length) {
        listScore.push(obj);
      }
      const puzzleList = await PuzzleModal.find();
      io.emit('DANH_SACH_USER', listScore);
      io.emit('ALL_PUZZLE', puzzleList);
    });

    socket.on('clietn-send-score', (score) => {
      handleScore(score);
      console.log(listScore);
      io.emit('server-send-score', listScore);
    });

    socket.on('disconnect', () => {
      const index = arrUserInfo.findIndex((user) => user.id === socket.peerId);
      arrUserInfo.splice(index, 1);
      io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    });
  });
};
