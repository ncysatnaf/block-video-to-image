const { exec, execSync } = require('child_process')
const fs = require('fs')

const getfileName = () => {
    return __filename.split('/').pop().split('.').shift()
}

const GetFileInfo = (file) => {
    let buf = execSync(`ffprobe -v quiet -print_format json -show_format -show_streams ${file}`)
    return JSON.parse(buf)
}

const filename = process.argv[2]
const per = process.argv[3] || 100
const fps = 10
const storeDir = `example/${getfileName()}`

const taskQueue = []
const doneQueue = []

const { format, streams } = GetFileInfo(filename)
const [audio, video] = streams
const { duration } = format
const { height } = video


const main = () => {
    checkDirExists(storeDir)

    let i = 0
    do {
        i += per
        taskQueue.push(i)
    } while (i < duration)

    extracter()
}


const extracter = () => {
    new Promise((resolve, reject) => {
        let current = taskQueue[0]
        exec(`ffmpeg -i ${filename} -vf scale=${height}:-1 -ss ${current} -t 10 -r ${fps} -y ${storeDir}/${filename}${current}.gif `, (err, stdout, stderr) => {
            if (err) {
                taskQueue.unshift(current)
                reject(err)
            }
            if (stderr) {
                doneQueue.push(current)
                console.log(`花费${process.uptime()}s, 已完成: ${doneQueue.length}, 还剩余: ${taskQueue.length}`)
                if (taskQueue.length > 0) {
                    resolve(extracter())
                }
            }
        })
        taskQueue.shift()
    })
}

const checkDirExists = (dir) => {
    try {
        fs.statSync(dir)
    } catch (e) {
        fs.mkdirSync(dir)
    }
}

main()