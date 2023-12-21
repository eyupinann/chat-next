import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import socket from '../../websocket';


const Chat: React.FC = ({ authenticated, username, handleLogout }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState({});
    const [usernames, setUsername] = useState('');


    useEffect(() => {
        if (!authenticated) {
            router.push('/');
        } else {
            setLoading(false);
        }

        const storedUsername = localStorage.getItem('username');

        if (storedUsername) {
            setUsername(storedUsername);
        }

        socket.emit('getActiveUsers');


        socket.on('activeUsers', (users) => {
            if (users && typeof users === 'object') {
                const filteredUsers = Object.fromEntries(
                    Object.entries(users).filter(([socketID, username]) => username.trim() !== '' && username !== 'Unknown')
                );
                console.log('Active Users:', JSON.stringify(filteredUsers, null, 2));
                setActiveUsers(filteredUsers);
            } else {
                // Hata durumunu ele alın veya uygun bir şekilde işleyin
                console.error('Invalid or null users:', users);
            }
        });


        socket.on('message', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
            console.log('Active msg:', JSON.stringify(msg, null, 2));
        });

        return () => {
            socket.off('activeUsers');
            socket.off('message');
        };

    }, [authenticated]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const sendMessage = () => {
        socket.emit('message', { usernames, message });
        setMessage('');
    };

    return (
        <div style={{  borderRadius: '8px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)', background: '#fff', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <style jsx global>{`
      body {
        margin: 0px;
        padding: 0px;
      }
    `}</style>
            <div style={{backgroundColor: '#1d1042'}}>
            <button onClick={handleLogout} style={{ marginTop: '22px', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#b3f', cursor: 'pointer', width: '85px', float: 'right' }}>
                Logout
            </button>
            <h1 style={{ textAlign: 'center', color: '#ffffff', float: 'left' }}>Chat</h1>

            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px', backgroundColor: '#392560', padding: '5px', alignItems: 'center' }}>
                <h2 style={{ flex: '1 0 auto', marginRight: '20px', textAlign: 'center', color: '#ffffff' }}>Active Users</h2>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {Object.entries(activeUsers).map(([socketID, user]) => (
                        <li key={socketID} style={{ marginLeft: '20px', marginBottom: '8px', fontSize: '25px', fontWeight: 'bold', position: 'relative' ,color: 'white'}}>
                            <span style={{ transform: 'translateY(-50%)', color: 'green', fontSize: '42px' }}>&#8226;</span>
                            {user}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ flex: '3', overflowY: 'auto' }}>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {messages.map((msg, index) => (
                        <li key={index} style={{ marginBottom: '8px', fontSize: '22px', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', justifyContent: msg.usernames === usernames ? 'flex-end' : 'flex-start' }}>
                            {msg.usernames === usernames ? (
                                <div>
                                    <div style={{ marginRight: '8px', color: 'black' }}>You:</div>
                                    <div style={{"backgroundColor":"#c2f3c2","maxWidth":"300px","overflowY":"auto","overflowX":"auto","padding":"10px","borderRadius":"10px","fontSize":"15px", "width" : "150px"}}>{msg.message}</div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ marginRight: '8px', color: 'black' }}>{msg.usernames }:</div>
                                    <div style={{"backgroundColor":"aliceblue","maxWidth":"300px","overflowY":"auto","overflowX":"auto","padding":"10px","borderRadius":"10px","fontSize":"15px", "width" : "150px"}}>{msg.message}</div>
                                </div>
                            )}





                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ display: 'flex', marginTop: '10px', alignItems: 'center', padding: '12px', backgroundColor: '#f9f5eb' }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ marginRight: '20px', flex: 1, padding: '20px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage} style={{ width: '150px', backgroundColor: '#09753a', padding: '10px', border: 'none', outline: 'none', color: '#eae3d2', cursor: 'pointer' }}>
                    Send
                </button>
            </div>

        </div>

    );
}

export default Chat;

