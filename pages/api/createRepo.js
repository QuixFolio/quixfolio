import { load } from 'cheerio';

async function checkRepoStatus(repoName, user, token) {
    let status = await fetch(`https://api.github.com/repos/${user}/${repoName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.message) {
                return false
            }
            else {
                return true
            }
        })
    return status
}

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
    console.log(repoOwner, repoName, user)
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
            return data
        })
    console.log(repo)
    if (repo.errors) {
        // return res.status(400).json(repo)
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
    let defaultBranch = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, {
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
            return data.default_branch
        })
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
            while (!await checkRepoStatus(req.body.cloneName, user, token)) {
                await new Promise(resolve => setTimeout(resolve, 200))
            }
            let pages = {}
            // fetch all of the pages in the schema
            for (let page in data.schema) {
                if (!data.schema[page].page) continue
                page = data.schema[page].page
                if (!pages[page]) {
                    await fetch(`https://api.github.com/repos/${user}/${req.body.cloneName}/contents/${page}`, {
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
                                pages[page] = {
                                    content: content,
                                    sha: file.sha
                                }
                            }
                        })
                }
            }
            Object.keys(req.body).forEach(key => {
                if (Array.isArray(req.body[key])) {
                    if (req.body[key].length === 0) return
                    let $ = load(pages[data.schema[key].page].content)
                    let div = $(`#${key}`).children().first().clone()
                    $(`#${key}`).children().remove()
                    for (let item of req.body[key]) {
                        let el = div.clone()
                        Object.keys(item).forEach(k => {
                            if (el.find(`[${k}]`).is("img")) {
                                el.find(`[${k}]`).attr("src", item[k])
                                return
                            } else if (el.find(`[${k}]`).is("a")) {
                                el.find(`[${k}]`).attr("href", item[k])
                                return
                            }
                            el.find(`[${k}]`).text(item[k])
                        })
                        $(`#${key}`).append(el)
                    }
                    pages[data.schema[key].page].content = $.html()
                } else {
                    try {
                        let $ = load(pages[data.schema[key].page].content)
                        $(`#${key}`).text(req.body[key])
                        pages[data.schema[key].page].content = $.html()
                    } catch (error) {
                    }
                }
            })
            let $ = load(pages["index.html"].content)
            console.log($.html())

            for (let page in pages) {
                console.log(page)
                // await Promise.all(Object.keys(pages).map(async page => {
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
            }
        })

    res.status(200).json({ status: "ok" })
}