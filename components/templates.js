import Image from "next/image"
import { useEffect, useState } from "react"
import Grid from '@mui/material/Grid';
import { Button, Dialog, DialogContent, DialogTitle, Paper, TextField } from "@mui/material";
import Link from "next/link";
import { Box } from "@mui/system";

export default function Templates() {
    const [templates, setTemplates] = useState([])
    const [accessToken, setAccessToken] = useState(null)
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        repoOwner: "",
        repoName: "",
        cloneName: "",
        name: "",
        summary: "",
        education: [],
        workExperience: [],
        publication: [],
        projects: [],
        skills: [],
        achievements: [],
        links: [],
    })
    const sample = {
        education: {
            university: "",
            startYear: "",
            endYear: "",
            major: "",
            gpa: "",
            addInfo: "",
            releventCoursework: ""
        },
        workExperience: {
            company: "",
            location: "",
            position: "",
            startDate: "",
            endDate: "",
            summary: "",
            image: "",
        },
        publication: {
            publication: "",
        },
        projects: {
            name: "",
            description: "",
            source: "",
            demo: "",
            image: "",
            startDate: "",
            endDate: "",
        },
        skills: {
            skills: "",
        },
        achievements: {
            name: "",
            date: "",
            position: "",
        },
        links: {
            name: "",
            link: ""
        }
    }

    useEffect(() => {
        let token = localStorage.getItem("accessToken")
        setAccessToken(token)
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
                                <Image
                                    src={template.config.image}
                                    alt={template.config.name}
                                    width={200}
                                    height={200}
                                    style={{ borderRadius: "10px", objectFit: "cover" }}
                                />
                                <p>{template.config.description}</p>
                                <div>
                                    <Link
                                        href={template.homepage ?? "#"}
                                    >
                                        View Template
                                    </Link>
                                </div>
                                <div>
                                    <Link
                                        href={template.html_url ?? "#"}
                                    >
                                        View Repo
                                    </Link>
                                </div>
                                <Button variant="contained"
                                    onClick={() => {
                                        // set the repo owner and name
                                        setForm({
                                            ...form,
                                            repoOwner: "QuixFolio",
                                            repoName: template.config.id,
                                        })
                                        setOpen(true)
                                    }}
                                >
                                    Create Repo
                                </Button>
                            </Grid>
                        )
                    })
                }
            </Grid>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                scroll="paper">
                <DialogTitle>Enter Details</DialogTitle>
                <DialogContent>
                    <Box component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1 },
                        }}
                        onSubmit={(e) => {
                            e.preventDefault()
                            console.log(form)
                            fetch("/api/createRepo", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json"
                                },
                                body: JSON.stringify({
                                    accessToken: accessToken,
                                    ...form
                                })
                            })
                                .then(res => res.json())
                                .then(data => {
                                    console.log(data)
                                })
                        }}>
                        {
                            Object.keys(form).map((key, index) => {
                                // check if array or not
                                if (Array.isArray(form[key])) {
                                    let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                                        return str.toUpperCase();
                                    })
                                    return (
                                        <div key={index}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <h2>{label}</h2>
                                                <Button variant="outlined"
                                                    color="success"
                                                    onClick={() => {
                                                        setForm({
                                                            ...form,
                                                            [key]: [...form[key], sample[key]]
                                                        })
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                            <Box
                                                sx={{ '& > :not(style)': { m: 1 } }}
                                            >
                                                {
                                                    form[key].map((item, index) => {
                                                        return (
                                                            <Paper key={index} elevation={2}
                                                                style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexDirection: "column" }}
                                                            >
                                                                <div>
                                                                    <Button variant="contained"
                                                                        color="error"
                                                                        onClick={() => {
                                                                            let newItem = [...form[key]]
                                                                            newItem.splice(index, 1)
                                                                            setForm({
                                                                                ...form,
                                                                                [key]: newItem
                                                                            })
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                                {
                                                                    Object.keys(item).map((k, i) => {
                                                                        // convert camel case to sentence case
                                                                        let label = k.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                                                                            return str.toUpperCase();
                                                                        })
                                                                        return (
                                                                            <TextField
                                                                                fullWidth
                                                                                key={i}
                                                                                label={label}
                                                                                variant="outlined"
                                                                                value={item[k]}
                                                                                onChange={(e) => {
                                                                                    let newItem = [...form[key]]
                                                                                    newItem[index][k] = e.target.value
                                                                                    setForm({
                                                                                        ...form,
                                                                                        [key]: newItem
                                                                                    })
                                                                                }}
                                                                            />
                                                                        )
                                                                    })
                                                                }
                                                            </Paper>
                                                        )
                                                    })
                                                }
                                            </Box>

                                        </div>
                                    )
                                } else {
                                    let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                                        return str.toUpperCase();
                                    })
                                    return (
                                        <TextField
                                            key={index}
                                            label={label}
                                            variant="outlined"
                                            fullWidth
                                            value={form[key]}
                                            disabled={key === "repoOwner" || key === "repoName"}
                                            onChange={(e) => {
                                                setForm({
                                                    ...form,
                                                    [key]: e.target.value
                                                })
                                            }}
                                        />
                                    )
                                }
                            })
                        }
                        <Button variant="contained" type="submit">Submit</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div >
    )
}