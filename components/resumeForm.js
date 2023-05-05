import { useEffect, useState } from "react"
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from "@mui/lab";
import ImportResume from "./importResume";

export default function ResumeForm({ template, open, setOpen, form, accessToken, user, update, setUpdate }) {
    const [loading, setLoading] = useState(false)
    const [sample, setSample] = useState({})
    const [formState, setFormState] = useState(form)

    useEffect(() => {
        if (!template || Object.keys(template).length === 0) return
        let sampleObj = {}
        let formObj = {}
        Object.keys(template.config.schema).forEach(key => {
            if (template.config.schema[key].type === "array") {
                sampleObj[key] = {}
                formObj[key] = form[key] ?? []
                Object.keys(template.config.schema[key].items).forEach(itemKey => {
                    sampleObj[key][itemKey] = template.config.schema[key].items[itemKey].default
                })
            }
            else {
                sampleObj[key] = template.config.schema[key].default
                formObj[key] = form[key] ?? template.config.schema[key].default ?? " "
            }
        })
        // move repoOwner, repoName, cloneName to the top
        let repoOwner = formObj.repoOwner
        let repoName = formObj.repoName
        let cloneName = formObj.cloneName
        delete formObj.repoOwner
        delete formObj.repoName
        delete formObj.cloneName
        formObj = { repoOwner, repoName, cloneName, ...formObj }
        setFormState(formObj)
        setSample(sampleObj)
    }, [template, form])

    function matchKey(key, json) {
        let found = false
        Object.keys(json).forEach(jsonKey => {
            if (jsonKey.toLowerCase().includes(key.toLowerCase())) {
                found = true
                return
            }
        })
        return found
    }

    function onResumeImport(json) {
        let newFormState = { ...formState }
        Object.keys(newFormState).forEach(key => {
            if (matchKey(key, json)) {
                if (Array.isArray(newFormState[key])) {
                    newFormState[key] = []
                    for (let i = 0; i < json[key].length; i++) {
                        let newObj = {}
                        Object.keys(sample[key]).forEach(itemKey => {
                            if (typeof json[key][i] === "object") {
                                if (itemKey in json[key][i]) newObj[itemKey] = json[key][i][itemKey]
                                else newObj[itemKey] = sample[key][itemKey]
                            }
                        })
                        newFormState[key].push(newObj)
                    }
                } else {
                    newFormState[key] = json[key]
                }
            }
        })
        setFormState(newFormState)
    }

    return (
        <Dialog
            open={open}
            onClose={() => {
                if (!loading) {
                    setOpen(false)
                    // wait for the animation to finish
                    setTimeout(() => {
                        setFormState({})
                    }, 300)
                }
            }}
            scroll="paper">
            <DialogTitle>Enter Details</DialogTitle>
            <DialogContent>
                {Object.keys(formState).length === 0 ?
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <CircularProgress />
                    </Box>
                    :
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
                                    username: user.login,
                                    ...formState
                                })
                            })
                                .then(res => res.json())
                                .then(data => {
                                    setLoading(false)
                                    if (data.error) {
                                        alert(data.error)
                                    } else {
                                        setOpen(false)
                                        setUpdate(!update)
                                    }
                                })
                        }}>
                        {
                            Object.keys(formState).map((key, index) => {
                                if (Array.isArray(formState[key])) {
                                    let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                                        return str.toUpperCase();
                                    })
                                    return (
                                        <div key={index}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <h2>{label}</h2>
                                                <IconButton
                                                    onClick={() => {
                                                        setFormState({
                                                            ...formState,
                                                            [key]: [...formState[key], Object.assign({}, sample[key])]
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
                                                    formState[key].map((item, index) => {
                                                        return (
                                                            <Paper key={index} elevation={2}
                                                                style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexDirection: "column" }}
                                                            >
                                                                <div>
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            let newItem = [...formState[key]]
                                                                            newItem.splice(index, 1)
                                                                            setFormState({
                                                                                ...formState,
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
                                                                        let type = template.config.schema[key].items[k].type
                                                                        if (type === "textarea") {
                                                                            type = "textarea"
                                                                        }
                                                                        else if (type === "integer") {
                                                                            type = "number"
                                                                        } else {
                                                                            type = "text"
                                                                        }
                                                                        return (
                                                                            <TextField
                                                                                fullWidth
                                                                                key={i}
                                                                                label={label}
                                                                                variant="outlined"
                                                                                value={item[k]}
                                                                                multiline={type === "textarea"}
                                                                                rows={type === "textarea" ? 3 : undefined}
                                                                                inputProps={{
                                                                                    type: type,
                                                                                    step: type === "number" ? "0.1" : undefined,
                                                                                    min: type === "number" ? "0" : undefined
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    let newItem = [...formState[key]]
                                                                                    newItem[index][k] = e.target.value
                                                                                    setFormState({
                                                                                        ...formState,
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
                                }
                                else {
                                    let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                                        return str.toUpperCase();
                                    })
                                    let type = template.config.schema[key]?.type
                                    if (type === "textarea") {
                                        type = "textarea"
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
                                            multiline={type === "textarea"}
                                            rows={type === "textarea" ? 3 : undefined}
                                            value={formState[key]}
                                            // disabled={key === "repoOwner" || key === "repoName"}
                                            disabled={template.config.schema[key]?.readOnly}
                                            onChange={(e) => {
                                                setFormState({
                                                    ...formState,
                                                    [key]: e.target.value
                                                })
                                            }}
                                        />
                                    )
                                }
                            })
                        }
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                            <ImportResume callback={onResumeImport} />
                            <LoadingButton variant="contained"
                                loading={loading}
                                disabled={accessToken === null}
                                type="submit">
                                Submit
                            </LoadingButton>
                        </Box>
                    </Box>
                }
            </DialogContent>
        </Dialog>
    )
}