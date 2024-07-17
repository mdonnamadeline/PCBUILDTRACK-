import React from 'react';
import { Card, Grid } from "@mui/material";
import Sidebar from "./Sidebar";
import CAFE from "../logo/CafeReyes.png";
import './Business.css';

const data = [
  {
    id: 1,
    link: "http://192.168.10.18:3000",
    imageUrl: CAFE,
  },
  {
    id: 2,
    link: "http://192.168.10.21",
    imageUrl: CAFE,
  },
  {
    id: 3,
    link: "https://192.168.10.25",
    imageUrl: CAFE,
  },
];

export default function Business() {
  return (
    <div className="flex-container">
      <Sidebar className="sidebar" />
      <div className="main-content">
        <Grid container spacing={2}>
          {data.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.id}>
              <Card>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <img src={item.imageUrl} alt={`Item ${item.id}`} />
                </a>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
