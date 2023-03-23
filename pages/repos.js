import { LoadingButton } from "@mui/lab"
import { Button, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"

export default function Repos({ token, user }) {
    const [repos, setRepos] = useState([])
    const [loading, setLoading] = useState([])
    useEffect(() => {
        if (token && user) {
            fetch("/api/getRepos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    accessToken: token,
                    username: user.login
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setRepos(data)
                    setLoading(Array(data.length).fill(false))
                })
        }
    }, [token, user])
    return (
        <div>
            <h1>Repos</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Template</TableCell>
                            <TableCell>Deployment URL</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            repos.map((repo, i) => {
                                return (
                                    <TableRow key={repo.name}>
                                        <TableCell>
                                            <Link
                                                href={repo.url}
                                            >
                                                {repo.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{repo.description}</TableCell>
                                        <TableCell>{repo.templateRepository.name}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={repo.homepageUrl ?? ""}
                                            >
                                                {repo.homepageUrl}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <LoadingButton
                                                loading={loading[i]}
                                                variant="contained"
                                                color="error"
                                                onClick={() => {
                                                    // set loading[i] to true
                                                    setLoading(loading.map((l, j) => j === i ? true : l))
                                                    fetch("/api/deleteRepo", {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            "Accept": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            accessToken: token,
                                                            repoName: repo.name,
                                                            owner: user.login
                                                        })
                                                    })
                                                        .then(res => res.json())
                                                        .then(data => {
                                                            setLoading(loading.map((l, j) => j === i ? false : l))
                                                            setRepos(repos.filter(r => r.name !== repo.name))
                                                        })
                                                }}
                                            >
                                                Delete
                                            </LoadingButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    )
}