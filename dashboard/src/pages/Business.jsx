import React from 'react';
import { Card, Grid } from "@mui/material";
import Sidebar from "./Sidebar";
import Cafe from "../logo/CafeReyes.png";
import Ohmart from "../logo/Ohmart.png";
import savemore from "../logo/savemore.png";
import './Business.css';

const data = [
  {
    id: 1,
    link: "http://192.168.10.18:3000",
    imageUrl: Cafe,
  },
  {
    id: 2,
    link: "http://192.168.10.21",
    imageUrl: Ohmart,
  },
  {
    id: 3,
    link: "http://192.168.10.25",
    imageUrl: savemore,
  },
];

export default function Business() {
  return (
    <div className="flex-container">
      <Sidebar className="sidebar" />
      <div className="main-content">
        <div className="head-con">
          YOU BILI DITO
        </div>
        <Grid container spacing={2} className="cards-container">
          {data.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.id}>
              <Card className="business-card">
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
