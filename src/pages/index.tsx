// pages/chat.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import socket from '../../websocket';


const Index: React.FC = ({ setAuthenticated }) => {
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleLogin = () => {
        if (username.trim() !== '') {
            setUsername(username);
            localStorage.setItem('username', username);
            const  storedUsername = username;
            socket.emit('newUser', { username: storedUsername, socketID: socket.id });
            setAuthenticated(true);
            router.push({
                pathname: '/chat',
            });
        }
    };
    return (
        <div style={{ margin: '0', padding: '0', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(/ny.jpg)`, backgroundSize: 'cover' }}>
            <style jsx global>{`
      body {
        margin: 0px;
        padding: 0px;
      }
    `}</style>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px', width: '400px', padding: '20px', margin: '0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                    <h4 style={{fontSize: '1.5em',fontWeight: 'normal'}}>Enter your username</h4>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '10px', padding: '8px', width: '400px' }}
                    />
                    <button
                        onClick={handleLogin}
                        style={{
                            width: '200px',
                            padding: '15px',
                            fontSize: '16px',
                            backgroundColor: '#66f',
                            color: 'white',
                            border: '1px solid #007BFF',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Index;
