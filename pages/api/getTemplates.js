export default async function handler(req, res) {
    let authorization = req.headers.authorization
    // get all repos that are templates from QuixFolio
    const repos = await fetch("https://api.github.com/orgs/QuixFolio/repos?sort=updated", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authorization
        }
        /* headers: authorization === "Bearer " ? {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authorization
        } : {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }, */
    })
        .then(res => res.json())
        .then(async data => {
            // return only those repos that are have is_template set to true
            let templates = []
            for (let repo in data) {
                if (data[repo].is_template) {
                    let config = await fetch(`https://api.github.com/repos/${data[repo].owner.login}/${data[repo].name}/contents/quixfolio.json`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": authorization
                        },
                    })
                        .then(res => res.json())
                        .then(data => {
                            return JSON.parse(Buffer.from(data.content, 'base64').toString('ascii'))
                        })
                    config.schema.repoOwner = {
                        type: "string",
                        default: data[repo].owner.login,
                        readOnly: true
                    }
                    config.schema.repoName = {
                        type: "string",
                        default: config.id,
                        readOnly: true
                    }
                    config.schema.cloneName = {
                        type: "string",
                        default: config.id,
                    }
                    if (config.image === "") {
                        config.image = "/default.png"
                    }
                    else if (!config.image.includes("http")) {
                        config.image = `https://raw.githubusercontent.com/${data[repo].owner.login}/${data[repo].name}/${data[repo].default_branch}/${config.image}`
                    }
                    data[repo].config = config
                    templates.push(data[repo])
                }
            }
            return templates
        }
        )
    res.status(200).json(repos)
}