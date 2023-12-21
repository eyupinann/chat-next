// _app.tsx
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedUsername = localStorage.getItem(username);
        console.log(storedUsername, 'storedUsername');

        if (storedUsername) {
            setAuthenticated(true);
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        setAuthenticated(false);
        setUsername('');
        sessionStorage.removeItem('username');
        router.push('/');
    };

    return <Component {...pageProps} authenticated={authenticated} username={username} setAuthenticated={setAuthenticated} handleLogout={handleLogout} />;
}

export default MyApp;
