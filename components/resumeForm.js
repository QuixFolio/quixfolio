import { useEffect, useState } from "react"
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from "@mui/lab";

export default function ResumeForm({ templates, open, setOpen, form, setForm, sample }) {
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let token = localStorage.getItem("accessToken")
        setAccessToken(token)
    }, [])
    return (
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
                    onSubmit={async (e) => {
                        e.preventDefault()
                        setLoading(true)
                        await fetch("/api/createRepo", {
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
                                setLoading(false)
                                setOpen(false)
                            })
                    }}>
                    {
                        Object.keys(form).map((key, index) => {
                            if (Array.isArray(form[key])) {
                                let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                                    return str.toUpperCase();
                                })
                                return (
                                    <div key={index}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <h2>{label}</h2>
                                            <IconButton
                                                onClick={() => {
                                                    setForm({
                                                        ...form,
                                                        [key]: [...form[key], Object.assign({}, sample[key])]
                                                    })
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>
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
                                                                <IconButton
                                                                    onClick={() => {
                                                                        let newItem = [...form[key]]
                                                                        newItem.splice(index, 1)
                                                                        setForm({
                                                                            ...form,
                                                                            [key]: newItem
                                                                        })
                                                                    }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </div>
                                                            {
                                                                Object.keys(item).map((k, i) => {
                                                                    // convert camel case to sentence case
                                                                    let label = k.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                                                                        return str.toUpperCase();
                                                                    })
                                                                    let type = templates.find(template => template.config.id === form.repoName).config.schema[key].items[k].type
                                                                    if (type === "integer") {
                                                                        type = "number"
                                                                    }
                                                                    else {
                                                                        type = "text"
                                                                    }
                                                                    return (
                                                                        <TextField
                                                                            fullWidth
                                                                            key={i}
                                                                            label={label}
                                                                            variant="outlined"
                                                                            value={item[k]}
                                                                            inputProps={{
                                                                                type: type,
                                                                                step: type === "number" ? "0.1" : undefined,
                                                                                min: type === "number" ? "0" : undefined
                                                                            }}
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
                                                                })}
                                                        </Paper>
                                                    )
                                                })}
                                        </Box>

                                    </div>
                                )
                            } else {
                                let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                                    return str.toUpperCase();
                                })
                                let type = templates.find(template => template.config.id === form.repoName).config.schema[key]?.type
                                if (type === "string") {
                                    type = "text"
                                }
                                else if (type === "integer") {
                                    type = "number"
                                } else {
                                    type = "text"
                                }
                                return (
                                    <TextField
                                        key={index}
                                        label={label}
                                        variant="outlined"
                                        fullWidth
                                        type={type}
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
                    <LoadingButton variant="contained"
                        loading={loading}
                        disabled={accessToken === null}
                        type="submit">
                        Submit
                    </LoadingButton>
                </Box>
            </DialogContent>
        </Dialog>
    )
}