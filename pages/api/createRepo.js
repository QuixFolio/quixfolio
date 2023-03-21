import { load } from 'cheerio';

export default async function handler(req, res) {
    const token = req.body.accessToken
    const repoOwner = req.body.repoOwner
    const repoName = req.body.repoName
    const user = await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(res => res.json())
        .then(data => {
            console.log(data)
            return data.login
        })
    let repo = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            "owner": user,
            "name": req.body.cloneName,
            "description": "Website created with QuixFolio",
            "include_all_branches": false,
            "private": false,
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            return data
        })
    if (repo.message) {
        repo = await fetch(`https://api.github.com/repos/${user}/${req.body.cloneName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                return data
            })
    }
    let defaultBranch = repo.default_branch
    // read /user/reponame/quixfolio.json
    await fetch(`https://raw.githubusercontent.com/${repoOwner}/${repoName}/${defaultBranch}/quixfolio.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(async data => {
            // wait for 1 second
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log(data.pages)
            let pages = {}
            // fetch all of the pages
            for (let page in data.pages) {
                // console.log(pages)
                if (!pages[data.pages[page]]) {
                    console.log(data.pages[page])
                    await fetch(`https://api.github.com/repos/${user}/${req.body.cloneName}/contents/${data.pages[page]}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })
                        .then(res => res.json())
                        .then(file => {
                            console.log(file)
                            if (file.content) {
                                let content = Buffer.from(file.content, 'base64').toString('ascii')
                                pages[data.pages[page]] = {
                                    content: content,
                                    sha: file.sha
                                }
                            }
                        })
                }
            }

            function changeContent(id, page, newContent) {
                const $ = load(pages[page].content)
                $(`#${id}`).text(newContent)
                pages[page].content = $.html()
            }

            changeContent("name", data.pages["name"], req.body.name)
            changeContent("summary", data.pages["summary"], req.body.summary)
            let $ = load(pages[data.pages["education"]].content)

            let educationDiv = $("#education").children().first().clone()
            $("#education").children().remove()
            for (let education of req.body.education) {
                let edu = educationDiv.clone()
                edu.find("[university]").text(education.university)
                edu.find("[start-year]").text(education.startYear)
                edu.find("[end-year]").text(education.endYear)
                edu.find("[major]").text(education.major)
                edu.find("[gpa]").text(education.gpa)
                edu.find("[add-info]").text(education.addInfo)
                edu.find("[relevent-coursework]").text(education.releventCoursework)
                $("#education").append(edu)
            }
            pages[data.pages["education"]].content = $.html()

            $ = load(pages[data.pages["work-experience"]].content)
            let workExperienceDiv = $("#work-experience").children().first().clone()
            $("#work-experience").children().remove()
            for (let workExperience of req.body.workExperience) {
                let work = workExperienceDiv.clone()
                work.find("[company]").text(workExperience.company)
                work.find("[location]").text(workExperience.location)
                work.find("[position]").text(workExperience.position)
                work.find("[start-date]").text(workExperience.startDate)
                work.find("[end-date]").text(workExperience.endDate)
                work.find("[summary]").text(workExperience.summary)
                work.find("[image]").attr("src", workExperience.image)
                $("#work-experience").append(work)
            }
            pages[data.pages["work-experience"]].content = $.html()

            $ = load(pages[data.pages["publication"]].content)
            let publicationDiv = $("#publication").children().first().clone()
            $("#publication").children().remove()
            for (let publication of req.body.publication) {
                let pub = publicationDiv.clone()
                pub.find("[title]").text(publication.title)
                pub.find("[authors]").text(publication.authors)
                pub.find("[publisher]").text(publication.publisher)
                pub.find("[date]").text(publication.date)
                pub.find("[url]").text(publication.url)
                pub.find("[summary]").text(publication.summary)
                $("#publication").append(pub)
            }
            pages[data.pages["publication"]].content = $.html()

            $ = load(pages[data.pages["projects"]].content)
            let projectsDiv = $("#projects").children().first().clone()
            $("#projects").children().remove()
            for (let project of req.body.projects) {
                let proj = projectsDiv.clone()
                proj.find("[name]").text(project.name)
                proj.find("[description]").text(project.description)
                proj.find("[source]").attr("href", project.source)
                proj.find("[demo]").attr("href", project.demo)
                proj.find("[image]").attr("src", project.image)
                proj.find("[start-date]").text(project.startDate)
                proj.find("[end-date]").text(project.endDate)
                $("#projects").append(proj)
            }
            pages[data.pages["projects"]].content = $.html()

            $ = load(pages[data.pages["skills"]].content)
            let skillsDiv = $("#skills").children().first().clone()
            $("#skills").children().remove()
            for (let skill of req.body.skills) {
                let sk = skillsDiv.clone()
                sk.find("[skills]").text(skill.skills)
                $("#skills").append(sk)
            }
            pages[data.pages["skills"]].content = $.html()

            $ = load(pages[data.pages["achievements"]].content)
            let achievementsDiv = $("#achievements").children().first().clone()
            $("#achievements").children().remove()
            for (let achievement of req.body.achievements) {
                let ach = achievementsDiv.clone()
                ach.find("[name]").text(achievement.name)
                ach.find("[date]").text(achievement.date)
                ach.find("[position]").text(achievement.position)
                $("#achievements").append(ach)
            }
            pages[data.pages["achievements"]].content = $.html()

            $ = load(pages[data.pages["links"]].content)
            let linksDiv = $("#links").children().first().clone()
            $("#links").children().remove()
            for (let link of req.body.links) {
                let lnk = linksDiv.clone()
                lnk.find("[link]").text(link.name)
                lnk.find("[link]").attr("href", link.link)
                $("#links").append(lnk)
            }
            pages[data.pages["links"]].content = $.html()

            console.log($.html())

            await Promise.all(Object.keys(pages).map(async page => {
                await fetch(`https://api.github.com/repos/${user}/${req.body.cloneName}/contents/${page}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "message": "Update page content",
                        "content": btoa(pages[page].content),
                        "sha": pages[page].sha
                    })
                }).then(res => res.json())
                    .then(data => {
                        console.log(data)
                    })
            }))
        })

    res.status(200).json({ status: "ok" })
}