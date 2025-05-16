import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/system";
import "../styles/ViewContactMessage.css";

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
});

function ViewContactMessage() {
  const [messages, setMessages] = useState([]);
  const { VITE_REACT_APP_API_HOST } = import.meta.env;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${VITE_REACT_APP_API_HOST}/api/contact`);
        setMessages(response.data.data || []);
      } catch (error) {
        alert("Failed to fetch messages.");
      }
    };
    fetchMessages();
  }, [VITE_REACT_APP_API_HOST]);

  return (
    <div className="page">
      <Sidebar />
      <div className="page-content">
        <h1>Contact Messages</h1>
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Contact No.</StyledTableCell>
                <StyledTableCell>Message</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((msg) => (
                  <TableRow key={msg._id}>
                    <TableCell>{msg.name}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell>{msg.contact}</TableCell>
                    <TableCell className="description-cell">{msg.message}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ViewContactMessage;