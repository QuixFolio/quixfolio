import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import GitHub from "./github";
import MenuIcon from '@mui/icons-material/Menu';
import Image from "next/image";
import logo from "../public/QuixFolio.png";
import Link from "next/link";
export default function Navbar() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton> */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Link href="/">
                            <Image
                                src={logo}
                                alt="QuixFolio"
                                height={45}
                                href="/"
                            />
                        </Link>
                    </Box>
                    <GitHub />
                </Toolbar>
            </AppBar>
        </Box>
    )
}