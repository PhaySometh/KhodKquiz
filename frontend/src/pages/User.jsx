import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';

const BASE_URL = 'http://localhost:3000';

const User = () => {
    const userToken = localStorage.getItem('userToken');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await axios.get(`${BASE_URL}/api/user`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    },
                });
                
                if (user.data) {
                    setUser(user.data);
                } else {
                    console.error('No user data found:', user.data.error);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [userToken]);

    return (
        <>
            <div>
                {user ? (
                    <>
                        <h1>{user.name}</h1>
                        <img src={user.picture} alt={user.name} />
                    </>
                ) : (
                    <h1>User not found</h1>
                )}
            </div>
        </>
    )
}

export default User;