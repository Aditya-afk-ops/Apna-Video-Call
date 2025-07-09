import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, LinearProgress } from '@mui/material';

const defaultTheme = createTheme();

export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [bgImage, setBgImage] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    // Generate new random image on component mount
    React.useEffect(() => {
        const generateImage = () => {
            const categories = ['nature', 'water', 'mountains', 'city', 'landscape'];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            return `https://source.unsplash.com/random/${width}x${height}/?${randomCategory},wallpaper`;
        };

        // Create new image to preload
        const img = new Image();
        img.src = generateImage();
        
        img.onload = () => {
            setBgImage(img.src);
            setLoading(false);
        };
        
        img.onerror = () => {
            // Fallback if Unsplash fails
            const e = Math.floor(Math.random()*4);
            if(e === 1) {
                setBgImage('https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80');
            } else if(e===2) {
                setBgImage('https://images.unsplash.com/photo-1749226697973-89f28598101c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDU1fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=1920&q=80');
            } else if( e===3) {
                setBgImage('https://images.unsplash.com/photo-1750912228794-92ec92276a50?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDl8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3Dw=600&auto=format&fit=crop&q=60');
            } else if(e == 4) {
                setBgImage('https://images.unsplash.com/photo-1705481109538-fb7edf4a5758?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW91bnQlMjBmdWppfGVufDB8fDB8fHwww=600&auto=format&fit=crop&q=60');
            } else {
                setBgImage('https://images.unsplash.com/photo-1592636120953-3d2b28ebfd69?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDcxfDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3Dw=600&auto=format&fit=crop&q=60');
            }
            setLoading(false);
        };
    }, []);

    const handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } else {
                const result = await handleRegister(name, username, password);
                setMessage(result);
                setOpen(true);
                setFormState(0);
                setName('');
                setUsername('');
                setPassword('');
                setError('');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Authentication failed';
            setError(message);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                    }}
                >
                    {loading && (
                        <LinearProgress 
                            sx={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                width: '100%'
                            }} 
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {formState === 0 ? 'Sign in' : 'Create Account'}
                        </Typography>
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Button 
                                variant={formState === 0 ? "contained" : "outlined"} 
                                onClick={() => setFormState(0)}
                                sx={{ mr: 2 }}
                            >
                                Sign In
                            </Button>
                            <Button 
                                variant={formState === 1 ? "contained" : "outlined"} 
                                onClick={() => setFormState(1)}
                            >
                                Sign Up
                            </Button>
                        </Box>
                        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    value={name}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                            />
                            {error && (
                                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleAuth}
                                disabled={!username || !password || (formState === 1 && !name)}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={message}
            />
        </ThemeProvider>
    );
}