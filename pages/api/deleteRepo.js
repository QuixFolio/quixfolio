export default async function handler(req, res) {
    const { accessToken, repoName, owner } = req.body
    // delete the repo
    await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    })
    res.status(200).json({ message: "success" })
}