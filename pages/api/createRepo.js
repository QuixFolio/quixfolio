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
            Object.keys(req.body).forEach(key => {
                let ele = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
                if (Array.isArray(req.body[key])) {
                    if (req.body[key].length === 0) return
                    let $ = load(pages[data.pages[ele]].content)
                    let div = $(`#${ele}`).children().first().clone()
                    $(`#${ele}`).children().remove()
                    for (let item of req.body[key]) {
                        let el = div.clone()
                        Object.keys(item).forEach(k => {
                            let field = k.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
                            // check if the element is an image or a link
                            if (el.find(`[${k}]`).is("img")) {
                                el.find(`[${k}]`).attr("src", item[k])
                                return
                            } else if (el.find(`[${k}]`).is("a")) {
                                el.find(`[${k}]`).attr("href", item[k])
                                return
                            }
                            el.find(`[${field}]`).text(item[k])
                        })
                        $(`#${ele}`).append(el)
                    }
                    pages[data.pages[ele]].content = $.html()
                } else {
                    try {
                        let $ = load(pages[data.pages[ele]].content)
                        $(`#${ele}`).text(req.body[key])
                        pages[data.pages[ele]].content = $.html()
                    } catch (error) {
                    }
                }
            })
            let $ = load(pages["index.html"].content)
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