export default async function handler(req, res) {
    let token = req.body.accessToken
    let username = req.body.username
    let repos = await fetch(`https://api.github.com/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: `query {
                user(login: "${username}") {
                    repositories(first: 100) {
                        nodes {
                            name
                            description
                            url
                            homepageUrl
                            templateRepository {
                                name
                                owner {
                                    login
                                }
                            }
                        }
                    }
                }
            }`
        })
    }).then(res => res.json())
        .then(data => {
            return data.data.user.repositories.nodes
        })
    let quixfolioRepos = []
    for (let repo in repos) {
        if (repos[repo].templateRepository && repos[repo].templateRepository.owner.login === "QuixFolio") {
            quixfolioRepos.push(repos[repo])
        }
    }
    res.status(200).json(quixfolioRepos)
}
