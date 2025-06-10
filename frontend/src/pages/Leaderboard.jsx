import React from 'react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try{
            const response = await axios.get('https://localhost:5000/leaderboard');
            setLeaderboard(response.data);
            setLoading(false);
        } catch (error){
            console.error('Error Fetching leaderboard: ', error);
            setLoading(false);
        }
    };

    if(loading) return <div>Loading... </div>;

    return (
        <>
            <NavBar />
            <h1 className="text-center text-3xl font-bold mt-20">
                Leaderboard{' '}
            </h1>
            <div className="flex justify-center items-center mt-10">
                <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Score
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Sample data, replace with actual leaderboard data */}
                            {[1, 2, 3].map((rank) => (
                                <tr key={rank}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {rank}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        User{rank}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        Score{rank * 100}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
