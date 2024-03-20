import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CreateAuction() {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [response, setResponse] = useState('');

    const handleAuctionSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/auctions', {
                itemName, description, endDateTime
            });
            setResponse(result.data);
            if (result.data.success) {
                alert('Your auction was created successfully. Auction ID: ${result.data.auctionId}');
            } else {

            }
        } catch (error) {
            console.error('Error creating auction:', error);
            setResponse('An error occurred while creating the auction.');
        }
    }

}

export default CreateAuction;