import { useEffect } from "react";
import * as PDFJS from 'pdfjs-dist/build/pdf';
import { Button } from "@mui/material";

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

export default function ImportResume({ callback }) {

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

    function checkDate(str) {
        // dates can be in the form of mar 2020, march 2020, 03/2020, 03/20, 03-2020, 03-20, 2020
        let dateRegex = /((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s\d{4})|((january|february|march|april|may|june|july|august|september|october|novemeber|december)\s\d{4})|(\d{2}\/\d{4})|(\d{2}\/\d{2})|(\d{2}-\d{4})|(\d{2}-\d{2})|(\d{4})/gi;
        let date = str.match(dateRegex);
        if (date) {
            return date;
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
    function pdfToJSON(typedarray) {
        let json = {};
        const loadingTask = PDFJS.getDocument(typedarray);
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
                    // links can be in the form of linkedin.com/in/username, github.com/username, or just a url
                    // such as https://www.linkedin.com/in/username
                    // get the domain name such as linkedin or github
                    let domain = link.split('.');
                    json.links.push({ "name": domain[0], "link": link });
                }
                if (item.str.trim().toLowerCase() === 'projects') {
                    let fontName = item.fontName;
                    json.projects = [];
                    let projects = [];
                    let j = i + 1;
                    let first = resumeArray[j];
                    let project = []
                    for (j = i + 1; j < resumeArray.length; j++) {
                        if (fontName === resumeArray[j].fontName && checkSection(resumeArray[j].str)) {
                            break;
                        }
                        if (first.fontName === resumeArray[j].fontName) {
                            if (project.length !== 0) {
                                projects.push(project);
                            }
                            project = [];
                        }
                        project.push(resumeArray[j]);
                    }
                    i = j - 1;
                    projects.push(project);
                    for (let k = 0; k < projects.length; k++) {
                        let project = projects[k];
                        let jsonProject = {};
                        jsonProject.name = project[0].str;
                        jsonProject.description = "";
                        jsonProject.links = [];
                        for (let l = 1; l < project.length; l++) {
                            let link = checkLink(project[l].str);
                            if (link) {
                                jsonProject.links.push(link);
                                continue;
                            }
                            let date = checkDate(project[l].str);
                            if (date) {
                                if (!jsonProject.date) {
                                    jsonProject.startDate = date[0];
                                    if (date.length > 1) {
                                        jsonProject.endDate = date[1];
                                    }
                                }
                                else if (!jsonProject.endDate) {
                                    jsonProject.endDate = date[0];
                                }
                                continue;
                            }
                            jsonProject.description += project[l].str;
                        }
                        json.projects.push(jsonProject);
                    }
                }
            }
            callback(json);
        }).catch(function (reason) {
            console.error('Error: ' + reason);
        });
    }

    return (
        <Button variant="contained" component="label">
            Import from Resume
            <input hidden accept="application/pdf" type="file" onChange={(e) => {
                var file = e.target.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function () {
                    var typedarray = new Uint8Array(this.result);
                    pdfToJSON(typedarray);
                }
                fileReader.readAsArrayBuffer(file);
                e.target.value = null;
            }} />
        </Button>
    );
}
