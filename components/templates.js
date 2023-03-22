import Image from "next/image"
import { useEffect, useState } from "react"
import Grid from '@mui/material/Grid';
import { Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogContent, DialogTitle, Paper, Skeleton, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { Box } from "@mui/system";
import ResumeForm from "./resumeForm";

export default function Templates() {
    const [templates, setTemplates] = useState([])
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({})
    const [sample, setSample] = useState({})

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("storage", () => {
                console.log("storage changed")
                let token = localStorage.getItem("accessToken")
                if (!token) return
                fetch("/api/getTemplates", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        setTemplates(data)
                    })
            })
        }
    }, [])

    return (
        <div>
            <h1>Templates</h1>
            {
                templates.length === 0 ?
                    <Grid container spacing={8} >
                        {
                            [1, 2, 3, 4].map((i) => {
                                return (
                                    <Grid item key={i}>
                                        <Card sx={{ width: 300 }}>
                                            <Skeleton variant="rectangular" width={300} height={150} />
                                            <CardContent>
                                                <Skeleton variant="text" />
                                                <Skeleton variant="text" />
                                                <Skeleton variant="text" />
                                            </CardContent>
                                            <CardActions>
                                                <Skeleton variant="rectangular" width={100} height={50} />
                                                <Skeleton variant="rectangular" width={100} height={50} />
                                                <Skeleton variant="rectangular" width={100} height={50} />
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                    :
                    <Grid container spacing={8} >
                        {
                            templates.map((template, index) => {
                                return (
                                    <Grid item key={index} >
                                        <Card key={index} sx={{ width: 300 }}>
                                            <CardMedia
                                                sx={{ height: 150 }}
                                                image={template.config.image}
                                                title={template.config.name}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {template.config.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {template.config.description}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    href={template.homepage ?? "#"}
                                                >
                                                    View Template
                                                </Button>
                                                <Button
                                                    size="small"
                                                    href={template.html_url ?? "#"}
                                                >
                                                    View Repo
                                                </Button>
                                                <Button variant="contained"
                                                    size="small"
                                                    onClick={() => {
                                                        let sampleObj = {}
                                                        let formObj = {}
                                                        Object.keys(template.config.schema).forEach(key => {
                                                            if (template.config.schema[key].type === "array") {
                                                                formObj[key] = []
                                                                sampleObj[key] = {}
                                                                Object.keys(template.config.schema[key].items).forEach(itemKey => {
                                                                    sampleObj[key][itemKey] = template.config.schema[key].items[itemKey].default
                                                                })
                                                            }
                                                            else {
                                                                formObj[key] = template.config.schema[key].default
                                                                sampleObj[key] = template.config.schema[key].default
                                                            }
                                                        })
                                                        console.log(sampleObj)
                                                        console.log(formObj)
                                                        setSample(sampleObj)
                                                        setForm(formObj)
                                                        setForm({
                                                            repoOwner: "QuixFolio",
                                                            repoName: template.config.id,
                                                            ...formObj
                                                        })
                                                        setOpen(true)
                                                    }}
                                                >
                                                    Create Repo
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
            }
            <ResumeForm
                open={open}
                setOpen={setOpen}
                form={form}
                setForm={setForm}
                sample={sample}
                templates={templates}
            />
        </div >
    )
}