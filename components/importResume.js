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
        let linkRegex = /((?:https?:\/\/)?(?:\w+\.)+[a-zA-Z]{2,}(?::\d+)?(?:\/[\w#!:.?+=&%@!-\/]*)?)\b(?<!@)/gm;
        // let linkRegex = /^\b((?:https?:\/\/)?(?:\w+\.)+[a-zA-Z]{2,}(?::\d+)?(?:\/[\w#!:.?+=&%@!-\/]*)?)\b(?<!@)/gm;
        let link = str.match(linkRegex);
        if (link) {
            return link;
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

    function checkEmail(str) {
        let emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gm;
        let email = str.match(emailRegex);
        if (email) {
            return email[0];
        }
        return false;
    }

    const sections = ["experience", "projects", "education", "skills", "awards", "publications", "languages", "interests", "references"];

    function checkSection(str) {
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
            for (let i = 0; i < resumeArray.length; i++) {
                if (resumeArray[i].str.trim().split(' ').length == 2) {
                    json.name = resumeArray[i].str;
                    break;
                }
            }
            for (let i = 1; i < resumeArray.length; i++) {
                let item = resumeArray[i];
                let phone = checkPhone(item.str);
                if (phone) {
                    json.phone = phone;
                }
                let link = checkLink(item.str);
                if (link) {
                    for (let j = 0; j < link.length; j++) {
                        let domain = link[j].split('.');
                        json.links.push({ "name": domain[0], "link": link[j] });
                    }
                }
                let email = checkEmail(item.str);
                if (email) {
                    json.email = email;
                }
                if (!json.projects) {
                    let projects = parseSection("projects", resumeArray, i);
                    if (projects) {
                        json.projects = projects.section;
                        i = projects.i;
                    }
                }
                if (!json.workExperience) {
                    let work = parseSection("work experiences", resumeArray, i);
                    if (work) {
                        json.workExperience = work.section;
                        json.experiences = work.section;
                        json.experience = work.section;
                        i = work.i;
                    }
                }
                if (!json.education) {
                    let education = parseSection("education", resumeArray, i);
                    if (education) {
                        json.education = education.section;
                        i = education.i;
                    }
                }
            }
            callback(json);
        }).catch(function (reason) {
            console.error('Error: ' + reason);
        });
    }

    function parseSection(section, resumeArray, i) {
        if (section.toLowerCase().includes(resumeArray[i].str.trim().toLowerCase())) {
            let fontName = resumeArray[i].fontName;
            let sections = [];
            let sectionList = [];
            let j = i + 1;
            let first = resumeArray[j];
            let sectionItem = []
            for (j = i + 1; j < resumeArray.length; j++) {
                if ((fontName === resumeArray[j].fontName && checkSection(resumeArray[j].str)) || j === resumeArray.length - 1) {
                    break;
                }
                if (first.fontName === resumeArray[j].fontName) {
                    if (sectionItem.length !== 0) {
                        sectionList.push(sectionItem);
                    }
                    sectionItem = [];
                }
                sectionItem.push(resumeArray[j]);
            }
            i = j - 1;
            sectionList.push(sectionItem);
            for (let k = 0; k < sectionList.length; k++) {
                let sectionItem = sectionList[k];
                let jsonSectionItem = {};
                jsonSectionItem.name = sectionItem[0].str;
                jsonSectionItem.company = sectionItem[0].str;
                jsonSectionItem.institution = sectionItem[0].str;
                jsonSectionItem.university = sectionItem[0].str;
                jsonSectionItem.description = "";
                jsonSectionItem.summary = "";
                jsonSectionItem.details = "";
                jsonSectionItem.details = "";
                jsonSectionItem.coursework = "";
                for (let l = 1; l < sectionItem.length; l++) {
                    if (sectionItem[l].str.trim().length > 3) {
                        jsonSectionItem.title = sectionItem[l].str;
                        jsonSectionItem.major = sectionItem[l].str;
                        break;
                    }
                }
                for (let l = 1; l < sectionItem.length; l++) {
                    let link = checkLink(sectionItem[l].str);
                    if (link) {
                        jsonSectionItem.links.push(link);
                        continue;
                    }
                    let date = checkDate(sectionItem[l].str);
                    if (date) {
                        if (!jsonSectionItem.date) {
                            jsonSectionItem.startDate = date[0];
                            if (date.length > 1) {
                                jsonSectionItem.endDate = date[1];
                            }
                        }
                        else if (!jsonSectionItem.endDate) {
                            jsonSectionItem.endDate = date[0];
                        }
                        continue;
                    }
                    jsonSectionItem.description += sectionItem[l].str;
                    jsonSectionItem.summary += sectionItem[l].str;
                    jsonSectionItem.details += sectionItem[l].str;
                    jsonSectionItem.coursework += sectionItem[l].str;
                }
                sections.push(jsonSectionItem);
            }
            return {
                "section": sections,
                "i": i
            };
        }
        return null;
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
