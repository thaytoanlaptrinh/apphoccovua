const mongoose = require('mongoose');
const path = require('path')
const fs = require('fs');
const { Post } = require('./models/Post');

mongoose.connect(`mongodb+srv://ketnoidb:ketnoidb@cluster0.yogryju.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => {
        console.log('Error connecting to database');
    });


const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'posts1.json')), 'utf-8')

async function importData() {
    try {
        await Post.create(data);
        console.log(`Đã Import ${data.length} data...`)
        process.exit();
    } catch (error) {
        console.log(error)
    }
}

async function deleteData(numberDelete) {
    try {
        if (numberDelete === 0) {
            await Post.deleteMany({});
            console.log(`Delete All data...`);
            process.exit();
        }
        let deleteDatabase = await Post.find({}).limit(numberDelete);
        if (deleteDatabase.length === 0) {
            console.log(`Data rỗng không có gì`);
            process.exit();
            return
        }
        let copy = { ...deleteDatabase }
        let ar = Object.keys(copy)
        deleteDatabase = ar.map(element => {
            return copy[element]._id
        })
        let databseString = deleteDatabase.toString();
        let databseArr = databseString.split(',');
        await Post.deleteMany({ _id: { $in: databseArr } });
        // for (let i = 0; i < numberDelete; i++) {
        //     await Post.deleteOne({})
        // }
        // Nếu xóa nhiều phải gọi rất nhiều lần
        console.log(`Delete ${numberDelete} data...`)
        process.exit();
    } catch (error) {
        console.log(error)
    }
}

if (process.argv[2] === '-i') {
    importData()

}

if (process.argv[2] === '-d') {
    if (!isNumeric(process.argv[3])) {
        deleteData(0);
        return
    }
    if (isNumeric(process.argv[3])) {
        deleteData(process.argv[3] * 1)
    } else {
        console.log('Tham số thứ 3 phải là một số nguyên');
    }
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}