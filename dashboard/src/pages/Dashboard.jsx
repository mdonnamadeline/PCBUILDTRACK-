import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Divider,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import { PieChart, Pie, Cell, Label, Tooltip } from "recharts";
import Sidebar from "./Sidebar";
import "../styles/Dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function Dashboard() {
     const navigate = useNavigate(); 
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

     useEffect(() => {
        const checkAuth = () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                navigate("/login");
                return;
            }
        };
        checkAuth();
    }, [navigate]);

    const fetchData = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            return;
        }

        try {
            // Fetch all transactions from the /api/reports endpoint
            const response = await axios.get(
                `${import.meta.env.VITE_REACT_APP_API_HOST}/api/reports`
            );
            const transactions = response.data;

            // Calculate totals from the transaction data
            let totalSales = 0;
            let totalOrders = transactions.length;
            let totalQuantity = 0;

            transactions.forEach((transaction) => {
                totalSales += parseFloat(transaction.price) || 0;
                totalQuantity += transaction.quantity || 0;
            });

            // Update state with calculated totals
            setTotalSales(totalSales);
            setTotalOrders(totalOrders);
            setTotalQuantity(totalQuantity);

            // Optionally store totals in localStorage
            localStorage.setItem("totalSales", totalSales);
            localStorage.setItem("totalOrders", totalOrders);
            localStorage.setItem("totalQuantity", totalQuantity);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setTotalSales(0);
            setTotalOrders(0);
            setTotalQuantity(0);
        }
    };

    useEffect(() => {
        const storedSales = localStorage.getItem("totalSales");
        if (storedSales) {
            setTotalSales(parseFloat(storedSales));
        }

        const storedOrders = localStorage.getItem("totalOrders");
        if (storedOrders) {
            setTotalOrders(parseInt(storedOrders, 10));
        }

        const storedQuantity = localStorage.getItem("totalQuantity");
        if (storedQuantity) {
            setTotalQuantity(parseInt(storedQuantity, 10));
        }

        fetchData();
    }, []);

    const chartData = [
        { name: "Orders", value: totalOrders, fill: "#d32f2f" },
        { name: "Sales", value: totalSales, fill: "#e9536f" },
        { name: "Total Quantity", value: totalQuantity, fill: "#ffa726" },
        { name: "Other", value: 580, fill: "#fbd5da" },
    ];

    const totalVisitors = chartData.reduce((acc, curr) => acc + curr.value, 0);


    return (
        <Box className="dashboard">
            <Sidebar />
            <Box component="main" className="main-content">
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>

                <div className="grid-container">
                    {/* Total Sales Card */}
                    <Card className="card">
                        <CardHeader title="Total Sales" />
                        <CardContent className="card-content">
                            <Typography
                                variant="h5"
                                component="div"
                                align="center"
                            >
                                ₱{totalSales.toFixed(2)}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                            >
                                Total sales revenue
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Total Orders Card */}
                    <Card className="card">
                        <CardHeader title="Total Orders" />
                        <CardContent className="card-content">
                            <Typography
                                variant="h5"
                                component="div"
                                align="center"
                            >
                                {totalOrders}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                            >
                                Total number of orders
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Total Quantity Card */}
                    <Card className="card">
                        <CardHeader title="Total Quantity" />
                        <CardContent className="card-content">
                            <Typography
                                variant="h5"
                                component="div"
                                align="center"
                            >
                                {totalQuantity}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                            >
                                Total quantity of items ordered
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Visitors Card */}
                    <Card className="card">
                        <CardHeader title="Overall" />
                        <CardContent className="card-content">
                            <PieChart width={250} height={250}>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    strokeWidth={5}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.fill}
                                        />
                                    ))}
                                    <Label
                                        value={totalVisitors.toLocaleString()}
                                        position="center"
                                        style={{
                                            fontSize: "24px",
                                            fontWeight: "bold",
                                        }}
                                    />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </CardContent>
                        <Divider />
                        <CardContent className="card-content">
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                            >
                                Trending up by 5.2% this month
                            </Typography>
                            <TrendingUp color="action" />
                        </CardContent>
                    </Card>
                </div>
            </Box>
        </Box>
    );
}
