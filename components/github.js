import { Button } from "@mui/material"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function GitHub() {
    const router = useRouter()
    useEffect(() => {
        if (!router.isReady) return
        if (router.query.code) {
            console.log(router.query.code)
            const code = router.query.code
            fetch("/api/github", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    code: code
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                })
        }
    }, [router.isReady])

    return (
        <div>
            <h1>GitHub</h1>
            <Button variant="contained"
                href={"https://github.com/login/oauth/authorize?" + new URLSearchParams({
                    client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
                    redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URL,
                    scope: "public_repo",
                    state: "1234567890"
                }).toString()}
            >
                Github
            </Button>
        </div>
    )
}