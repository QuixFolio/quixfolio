import { promises as fs } from 'fs';
import * as PDFJS from 'pdfjs-dist/build/pdf';

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

export default async function handler(req, res) {
    const loadingTask = PDFJS.getDocument('public/resume1.pdf');
    await loadingTask.promise.then(function (pdf) {
        pdf.getPage(1).then(function (page) {
            console.log(page);
        });
    }).catch(function (reason) {
        console.error('Error: ' + reason);
    });
    return res.status(200).json({ message: "success" });
}

/* export default async function handler(req, res) {
    let resumeJson = {};
    const resume = new ResumeParser("public/resume1.pdf");
    await resume.parseToJSON().then((data) => {
        resumeJson = data;
    }).catch((error) => {
        console.log(error);
    });
    return res.status(200).json(resumeJson);
} */