import * as fs from 'node:fs';
import * as path from 'node:path/posix';
import * as process from 'node:process';

import { unzipSync, zipSync } from "fflate";

const processFile = (fileName) => {

    const stat = fs.statSync(fileName);

    const parsedPath = path.parse(fileName);

    const newFileName = path.join(parsedPath.dir, `${parsedPath.name}.cleaned${parsedPath.ext}`);

    const fileToRead = fs.openSync(fileName, 'r');

    const fileToWrite = fs.openSync(newFileName, 'w');

    const buffer = new Buffer.alloc(stat.size);

    fs.readSync(fileToRead, buffer);

    const zipped = {};

    for(const [key, value] of Object.entries(unzipSync(buffer))) {
        if (key.includes('webextensions')) {
            continue;
        }
        zipped[key] = value;
    }

    const bufferToSave = zipSync(zipped);

    fs.writeSync(fileToWrite, bufferToSave);
};

const fileName = process.argv.at(-1);

if (fileName === undefined) {
    process.exit();
}

processFile(fileName);