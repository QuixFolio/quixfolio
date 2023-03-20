import Image from "next/image"
import { useEffect, useState } from "react"
import Grid from '@mui/material/Grid';
import { Button } from "@mui/material";

export default function Templates() {
    const [templates, setTemplates] = useState([])
    useEffect(() => {
        let accessToken = localStorage.getItem("accessToken")
        fetch("/api/getTemplates", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setTemplates(data)
            })
    }, [])

    return (
        <div>
            <h1>Templates</h1>
            <Grid container spacing={2}>
                {
                    templates.map((template, index) => {
                        return (
                            <Grid xs={4} key={index}>
                                <h2>{template.config.name}</h2>
                                <p>{template.description}</p>
                                <Image
                                    src={template.config.image}
                                    alt={template.config.name}
                                    width={200}
                                    height={200}
                                    style={{ borderRadius: "10px", objectFit: "cover" }}
                                />
                                <p>{template.config.description}</p>
                            </Grid>
                        )
                    })
                }
            </Grid>
            <Button variant="contained"
                onClick={() => {
                    fetch("/api/createRepo", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            accessToken: accessToken,
                            repoOwner: "QuixFolio",
                            repoName: "basic-template"
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data)
                        })
                }}
            >
                Create Repo
            </Button>
        </div>
    )
}