export default async function handler(req, res) {
    let authorization = req.headers.authorization
    console.log(authorization)
    // get all repos that are templates from QuixFolio
    const repos = await fetch("https://api.github.com/orgs/QuixFolio/repos", {
        method: "GET",
        headers: authorization === "Bearer " ? {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authorization
        } : {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
        .then(res => res.json())
        .then(async data => {
            console.log(data)
            // return only those repos that are have is_template set to true
            let templates = []
            for (let repo in data) {
                if (data[repo].is_template) {
                    let config = await fetch(`https://raw.githubusercontent.com/${data[repo].owner.login}/${data[repo].name}/gh-pages/quixfolio.json`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                    })
                        .then(res => res.json())
                        .then(data => {
                            return data
                        })
                    if (config.image === "") {
                        config.image = "/default.png"
                    }
                    else if (!config.image.includes("http")) {
                        config.image = `https://raw.githubusercontent.com/${data[repo].owner.login}/${data[repo].name}/gh-pages/${config.image}`
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