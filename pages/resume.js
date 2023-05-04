import { useEffect } from "react";
import * as PDFJS from 'pdfjs-dist/build/pdf';

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

export default function Resume() {

    function checkPhone(str) {
        let phoneRegex = /(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
        let phone = str.match(phoneRegex);
        if (phone) {
            return phone[0];
        }
        return false;
    }

    function checkLink(str) {
        let linkRegex = /^\b((?:https?:\/\/)?(?:\w+\.)+[a-zA-Z]{2,}(?::\d+)?(?:\/[\w#!:.?+=&%@!-\/]*)?)\b(?<!@)/gm;
        let link = str.match(linkRegex);
        if (link) {
            return link[0];
        }
        return false;
    }

    function checkSection(str) {
        let sections = ["experience", "education", "skills", "awards", "publications", "languages", "interests", "references"];
        for (let i = 0; i < sections.length; i++) {
            if (str.toLowerCase().includes(sections[i])) {
                return true;
            }
        }
        return false;
    }
    useEffect(() => {
        let json = {};
        const loadingTask = PDFJS.getDocument('/resume2.pdf');
        loadingTask.promise.then(async function (pdf) {
            // json.name = text.items[0].str;
            json.links = [];
            let resumeArray = [];
            // go through all pages
            for (let i = 1; i <= pdf.numPages; i++) {
                await pdf.getPage(i).then(async function (page) {
                    const textContent = page.getTextContent();
                    await textContent.then(function (text) {
                        for (let i = 0; i < text.items.length; i++) {
                            if (text.items[i].str === '') {
                                continue;
                            }
                            let item = text.items[i];
                            let j = i + 1;
                            for (j = i + 1; j < text.items.length; j++) {
                                if (text.items[j].str === '' || (text.items[j].str != " " && text.items[j].height !== item.height)) {
                                    break;
                                }
                                item.str += text.items[j].str;
                            }
                            i = j - 1;
                            resumeArray.push(item);
                        }
                    });
                });
            }
            json.name = resumeArray[0].str;
            for (let i = 1; i < resumeArray.length; i++) {
                let item = resumeArray[i];
                let phone = checkPhone(item.str);
                if (phone) {
                    json.phone = phone;
                }
                let link = checkLink(item.str);
                if (link) {
                    json.links.push(link);
                }
                if (item.str.trim().toLowerCase() === 'projects') {
                    let fontName = item.fontName;
                    json.projects = [];
                    let j = i + 1;
                    let first = resumeArray[j];
                    console.log(first);
                    let project = []
                    for (j = i + 1; j < resumeArray.length; j++) {
                        // console.log(resumeArray[j]);
                        if (fontName === resumeArray[j].fontName && checkSection(resumeArray[j].str)) {
                            break;
                        }
                        if (first.fontName === resumeArray[j].fontName) {
                            if (project.length !== 0) {
                                json.projects.push(project);
                            }
                            project = [];
                        }
                        project.push(resumeArray[j]);
                    }
                    i = j - 1;
                    json.projects.push(project);
                }
            }
            console.log(json);
        }).catch(function (reason) {
            console.error('Error: ' + reason);
        });
    }, []);

    function getSection(section){
        
    }

    return <div></div>;
}
