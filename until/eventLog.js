const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
let date = format(new Date(), 'dd-MM-yyyy');
var nameTxt = path.join(__dirname, '.././logs', `${date}-logfile.txt`);
let nameIcr = 0;
async function getFilesizeInBytes(filename) {
    var stats = await fs.stat(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}
async function handleSizeFile() {
    const sizeFile = await getFilesizeInBytes(nameTxt)
    if (+sizeFile > 50000) {
        nameIcr++;
        nameTxt = path.join(__dirname, '.././logs', `${date}-logfile${nameIcr}.txt`);
    }
}
const messageError = async (err) => {
    try {
        const date = format(new Date(), 'dd-MM-yyyy\thh:mm:ss')
        const contentLog = `${uuid()}, Ngày ${date} --- Tài khoản lichess: ${err} \n`;
        fs.appendFile(nameTxt, contentLog, 'utf-8')
        await handleSizeFile();
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    messageError
}