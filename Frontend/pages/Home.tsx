/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { FetchUSer, LogoutAPI, UpdateUserAmount } from '@/services/api'; // Import the new API call
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Ensure you have react-toastify installed
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useRouter } from 'next/navigation'; // Import useRouter



ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


interface User {
    id: number;
    status: string;
    email: string;
    amount: number;
}

type ApiResult = User[] | { error: boolean; message: string };

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
}

const Dashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const usersPerPage = 5;

    const [recentSales, setRecentSales] = useState<User[]>([]); // State for recent sales
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // State for dropdown visibility
    const router = useRouter(); // Initialize useRouter


    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(false);
                const result: ApiResult = await FetchUSer();

                if (Array.isArray(result)) {
                    setUsers(result);
                    updateChartData(result); // Update chart data after fetching users

                    // Simulate recent sales (replace with actual sales data logic)
                    const numRecentSales = Math.min(5, result.length); // Get up to 5 recent sales
                    const recent = result.slice(0, numRecentSales); // Get the first few users
                    setRecentSales(recent);

                } else if (result && typeof result === 'object' && 'error' in result) {
                    setError(true);
                    toast.error(result.message);
                } else {
                    setError(true);
                    toast.error("Unexpected response from the server.");
                }
            } catch (e: any) {
                setError(true);
                toast.error(`Failed to load users: ${e.message}`);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    const updateChartData = (usersData: User[]) => {
        const labels = usersData.map(user => user.email);
        const data = usersData.map(user => user.amount);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'User Amount',
                    data: data,
                    backgroundColor: 'rgba(102, 51, 153, 0.6)',
                    borderColor: 'rgba(102, 51, 153, 1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    const [chartData, setChartData] = useState<ChartData>({
        labels: [], // Initially empty
        datasets: [
            {
                label: 'User Amount',
                data: [],
                backgroundColor: 'rgba(102, 51, 153, 0.6)',
                borderColor: 'rgba(102, 51, 153, 1)',
                borderWidth: 1,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to stretch/shrink
        plugins: {
            legend: {
                display: false, // Remove the legend for a cleaner look
            },
            title: {
                display: true,
                text: 'User Amounts',
                color: 'white', // Set title text color to white
                font: {
                    size: 14, // Smaller title
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    display: false,  // Hide x-axis labels
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)', // Fainter grid
                }
            },
            y: {
                ticks: {
                    color: 'white',
                    font: {
                        size: 10, // Smaller y-axis labels
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)', // Fainter grid
                }
            },
        },
    };

    const downloadReport = () => {
        const csvData = convertToCSV(users); // Use the 'users' state here
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'user_report.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const convertToCSV = (data: User[]) => {
        const header = ['Email', 'Amount'];
        const rows = data.map(user => [user.email, user.amount]);
        return [header, ...rows].map(row => row.join(',')).join('\n');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = async () => {
        const result = await LogoutAPI();
        if (!result.error) {
            localStorage.removeItem("token");
            toast.success("Logged out successfully!");
            router.push("/");

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            toast.error(result.message);
        }
    };



    return (
        <div className="bg-gradient-to-br from-purple-900 to-purple-700 min-h-screen text-white font-sans">
            {/* Header */}
            <header className="p-4 flex items-center justify-between">
                <nav className="flex items-center space-x-6">
                    <a href="#" className="hover:text-purple-200">Overview</a>
                    <a href="#" className="hover:text-purple-200">Analytics</a>
                    <a href="#" className="hover:text-purple-200">
                        <button onClick={downloadReport} className="hover:text-purple-200">Reports</button>
                    </a>
                    <a href="#" className="hover:text-purple-200">Settings</a>
                </nav>
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="rounded-full bg-white text-purple-500 border w-8 h-8 flex items-center justify-center focus:outline-none"
                    >
                        SJ
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                            <button
                                onClick={handleLogout}
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue Card */}
                <div className="bg-white bg-opacity-10 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Total Revenue</h3>
                    <p className="text-2xl font-bold">$45,231.89</p>
                    <p className="text-sm text-pink-400">+20.1% from last month</p>
                </div>

                {/* Subscriptions Card */}
                <div className="bg-white bg-opacity-10 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Subscriptions</h3>
                    <p className="text-2xl font-bold">+2350</p>
                    <p className="text-sm text-pink-400">+180.1% from last month</p>
                </div>

                {/* Sales Card */}
                <div className="bg-white bg-opacity-10 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Sales</h3>
                    <p className="text-2xl font-bold">+12,234</p>
                    <p className="text-sm text-pink-400">+19% from last month</p>
                </div>

                {/* Active Now Card */}
                <div className="bg-white bg-opacity-10 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Active Now</h3>
                    <p className="text-2xl font-bold">+573</p>
                    <p className="text-sm text-pink-400">+201 since last hour</p>
                </div>

                {/* Overview Chart */}
                <div className="bg-white bg-opacity-10 rounded-lg shadow-md p-4 col-span-1 md:col-span-2 lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Overview</h3>
                    {/* Placeholder for Chart - replace with a charting library */}
                    {loading ? (
                        <p className="text-center text-yellow-400">Loading chart data...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">Failed to load chart data.</p>
                    ) : (
                        <div style={{ height: '200px' }}> {/* Adjust height as needed */}
                            <Bar options={chartOptions} data={chartData} />
                        </div>
                    )}

                </div>

                {/* Recent Sales */}
                <div className="bg-white bg-opacity-10 rounded-lg shadow-md p-4 col-span-1 md:col-span-2 lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Recent Sales</h3>
                    <ul>
                        {recentSales.map((user) => (
                            <li key={user.id} className="py-2 border-b border-purple-700 last:border-none flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-full bg-purple-500 w-6 h-6 flex items-center justify-center text-xs">
                                        {user.email.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm">{user.email.split('@')[0]}</p>
                                        <p className="text-xs text-gray-800">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-green-400">${user.amount.toFixed(2)}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* User Profiles */}
                <div className="bg-white bg-opacity-10 rounded-lg shadow-md p-4 mt-6 col-span-1 md:col-span-2 lg:col-span-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">User Profiles</h3>

                    {error ? (
                        <p className="text-center text-red-500">Failed to load users. Please try again later.</p>
                    ) : loading ? (
                        <p className="text-center text-yellow-400">Loading users...</p>
                    ) : (
                        <>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Filter emails..."
                                    className="bg-white text-gray-800 placeholder-gray-500 border border-gray-400 rounded-md p-2 w-1/2 focus:outline-none"
                                    onChange={handleSearch}
                                    value={searchTerm}
                                />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-500 text-white">
                                    <thead>
                                        <tr className="text-gray-700">
                                            <th className="border border-gray-500 p-2">ID</th>
                                            <th className="border border-gray-500 p-2">Status</th>

                                            <th className="border border-gray-500 p-2">Email</th>
                                            <th className="border border-gray-500 p-2">Amount</th>
                                            <th className="border border-gray-500 p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUsers.length > 0 ? (
                                            currentUsers.map((user) => (
                                                <tr key={user.id} className="text-center">
                                                    <td className="border border-gray-500 p-2 text-gray-800">{user.id}</td>
                                                    <td className="border border-gray-500 p-2 text-gray-800">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs ${user.status === 'active'
                                                                ? 'bg-green-500'
                                                                : 'bg-red-500'
                                                                }`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="border border-gray-500 p-2 text-gray-800">{user.email}</td>

                                                    <td className="border border-gray-500 p-2 text-gray-800">${user.amount.toFixed(2)}</td>
                                                    <td className="border border-gray-500 p-2">
                                                        <button
                                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded mr-2"
                                                        // Increase by 10
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"

                                                        >
                                                            -
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center text-gray-300 p-4">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <nav className="flex justify-center mt-4">
                                <ul className="flex list-style-none">
                                    {pageNumbers.map(number => (
                                        <li key={number} className="page-item">
                                            <button onClick={() => paginate(number)} className={`page-link px-4 py-2 mx-1 rounded ${currentPage === number ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                                                {number}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </>
                    )}
                </div>



            </main>
        </div>
    );
};

export default Dashboard;