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

const chartData = [
    { browser: "Orders", visitors: 275, fill: "#e21d48" },
    { browser: "Sales", visitors: 200, fill: "#e9536f" },
    { browser: "Sessions", visitors: 287, fill: "#f17e92" },
    { browser: "Visitor", visitors: 173, fill: "#f7abb6" },
    { browser: "Other", visitors: 190, fill: "#fbd5da" },
];

const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0);

export default function Dashboard() {
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

    const fetchData = async () => {
        try {
            const salesResponse = await axios.get(
                `${import.meta.env.VITE_REACT_APP_API_HOST}/api/sales/total`
            );
            const sales = salesResponse.data.totalSales || 0;
            setTotalSales(sales);
            localStorage.setItem("totalSales", sales);

            const ordersResponse = await axios.get(
                `${import.meta.env.VITE_REACT_APP_API_HOST}/api/orders/total`
            );
            const orders = ordersResponse.data.totalOrders || 0;
            setTotalOrders(orders);
            localStorage.setItem("totalOrders", orders);
        } catch (error) {
            console.error("Error fetching data:", error);
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
    }, []);

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

                    {/* Total Quantity Card */}
                    <Card className="card">
                        <CardHeader title="Total Orders" />
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
                                Total quantity of orders
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Other cards */}
                    <Card className="card">
                        <CardHeader title="Total Visitors" />
                        <CardContent className="card-content">
                            <PieChart width={250} height={250}>
                                <Pie
                                    data={chartData}
                                    dataKey="visitors"
                                    nameKey="browser"
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
                                    <Label
                                        value="Visitors"
                                        position="centerBottom"
                                        style={{
                                            fontSize: "14px",
                                            color: "#888",
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
