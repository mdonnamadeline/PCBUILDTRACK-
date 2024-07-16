import React from "react";
import Sidebar from "./Sidebar";
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
import "./Dashboard.css";

const chartData = [
    { browser: "Orders", visitors: 275, fill: "#e21d48" },
    { browser: "Sales", visitors: 200, fill: "#e9536f" },
    { browser: "Sessions", visitors: 287, fill: "#f17e92" },
    { browser: "Visitor", visitors: 173, fill: "#f7abb6" },
    { browser: "Other", visitors: 190, fill: "#fbd5da" },
];

const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0);

export default function Dashboard() {
    return (
        <Box className="dashboard">
            <Sidebar />
            <Box component="main" className="main-content">
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>

                <div className="grid-container">
                    {/* Total Visitors Card */}
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

                    {/* Total Orders Card */}
                    <Card className="card">
                        <CardHeader title="Total Orders" />
                        <CardContent className="card-content">
                            <Typography
                                variant="h5"
                                component="div"
                                align="center"
                            >
                                504
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

                    {/* Total Sales Card */}
                    <Card className="card">
                        <CardHeader title="Total Sales" />
                        <CardContent className="card-content">
                            <Typography
                                variant="h5"
                                component="div"
                                align="center"
                            >
                                $5678.90
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
                </div>
            </Box>
        </Box>
    );
}
