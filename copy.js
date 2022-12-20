const path = require("path");
const fs = require("fs");

class Path {
    constructor(path = "") {
        this.path = path;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    push(path) {
        if (!this.head) {
            this.head = new Path(path);
            this.tail = this.head;
            return;
        }

        this.tail.next = new Path(path);
        this.tail = this.tail.next;
    }

    pop() {
        if (!this.head) return "";
        const path = this.head.path;
        this.head = this.head.next;
        return path;
    }

    isEmpty() {
        return !this.head
    }
}

const travserseFolder = (currentPath) => {
    const queue = new Queue();
    const paths = [];
    queue.push(currentPath);
    while (!queue.isEmpty()) {
        var dir = queue.pop();
        var stat = fs.statSync(dir);
        paths.push({ path: dir, isFile: stat.isFile(), isDirectory: stat.isDirectory() });
        if (stat.isDirectory()) {
            for (var name of fs.readdirSync(dir)) {
                queue.push(path.join(dir, name))
            }
        }
    }
    return paths;
}

/**
 * @param source {string} the source path it can be a file or a folder.
 * @param destination {string} the destination directory.
 * 
 * @description 
 * it copies the files or directories from given soure to the destination directory 
 * if the destination dosn't exists then we will create the direcotiry for you and
 * it will replace any existed file in the destination with the copied file.
 */
function copySync(source, destination) {
    console.log('Start coping...');
    console.time("Finished at");
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, {
            recursive: true
        })
    }

    if (!fs.existsSync(source)) throw new Error("soure path dose not exists.");

    const stat = fs.statSync(source);
    if (stat.isFile()) {
        const content = fs.readFileSync(source);
        const filename = path.basename(source);
        fs.writeFileSync(path.join(destination, filename), content);
        return;
    }

    const paths = travserseFolder(source);
    for (let item of paths) {
        const basename = path.basename(source);
        let dir__destination =
            basename === "." ? destination + "/" + item.path
                : item.path.replace(basename, destination);

        if (item.isFile) {
            var content = fs.readFileSync(item.path);
            fs.writeFileSync(dir__destination, content)
        } else if (item.isDirectory) {
            if (!fs.existsSync(dir__destination)) {
                fs.mkdirSync(dir__destination);
            }
        }
    }
    console.timeEnd("Finished at")
}

if (process.argv.length >= 4) {
    copySync(process.argv[2], process.argv[3])
}

module.exports = copySync;