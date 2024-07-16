import React from "react";
import Sidebar from "./Sidebar";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Divider,
    Grid,
    Icon,
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
        <Box className="dashboard" sx={{ display: "flex" }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                 Dashboard
                </Typography>

                <Grid container spacing={3}>
                      {/* Total Visitors Card */}
                      <Grid item xs={12} sm={4}>
                        <Card>
                            <CardHeader title="Total Visitors" />
                            <CardContent>
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
                            <CardContent
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
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
                    </Grid>

                    {/* Total Orders Card */}
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardHeader title="Total Orders" />
                            <CardContent>
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
                    </Grid>

                    {/* Total Sales Card */}
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardHeader title="Total Sales" />
                            <CardContent>
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
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
