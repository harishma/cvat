/*
* Copyright (C) 2019 Intel Corporation
* SPDX-License-Identifier: MIT
*/

/* global
   require:true
*/

const JSZip = require('jszip');

onmessage = (e) => {
    const zip = new JSZip();
    if (e.data) {
        const { start, end, block } = e.data;

        zip.loadAsync(block).then((_zip) => {
            let index = start;
            _zip.forEach((relativePath) => {
                const fileIndex = index++;
                if (fileIndex <= end) {
                    _zip.file(relativePath).async('blob').then((fileData) => {
                        if (self.createImageBitmap) {
                            createImageBitmap(fileData).then((img) => {
                                postMessage({
                                    fileName: relativePath,
                                    index: fileIndex,
                                    data: img,
                                });
                            });
                        } else {
                            postMessage({
                                fileName: relativePath,
                                index: fileIndex,
                                data: fileData,
                                isRaw: true,
                            });
                        }
                    });
                }
            });
        });
    }
};
