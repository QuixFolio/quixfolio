import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function GitHub() {
    const router = useRouter()
    const [accessToken, setAccessToken] = useState(null)

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setAccessToken(localStorage.getItem("accessToken"))
        }
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
                    setAccessToken(data.accessToken)
                    localStorage.setItem("accessToken", data.accessToken)
                    // set the url to the current url without the code
                    router.replace(router.pathname, router.pathname, { shallow: true })
                })
        }
    }, [router.isReady])

    return (<>
        {accessToken ? <Button variant="contained" color="secondary" onClick={() => {
            localStorage.removeItem("accessToken")
            setAccessToken(null)
        }}>Logout</Button>
            :
            <Button variant="contained" color="secondary"
                href={"https://github.com/login/oauth/authorize?" + new URLSearchParams({
                    client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
                    redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URL,
                    scope: "public_repo",
                    state: "1234567890"
                }).toString()}
            >
                Login
            </Button>
        }
    </>
    )
}