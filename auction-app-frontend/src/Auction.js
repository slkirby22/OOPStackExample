import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Auction() {
    const { id } = useParams(); // Get auction ID from URL parameters
    const [auction, setAuction] = useState({});
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch auction details and bids
    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const auctionResponse = await axios.get(`http://localhost:3000/auctions/${id}`);
                setAuction(auctionResponse.data.auction);

                const bidsResponse = await axios.get(`http://localhost:3000/auctions/${id}/bids`);
                setBids(bidsResponse.data.bids);
            } catch (error) {
                console.error('Error fetching auction details:', error);
                setErrorMessage('Failed to load auction details.');
            }
        };

        fetchAuctionDetails();
    }, [id]);

    // Handle new bid submission
    const handleBidSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:3000/auctions/${id}/bid`, {
                bidAmount,
                // Assuming user ID is stored in session/localStorage; replace with actual logic
                userId: 'yourUserIdHere',
            });

            if (response.data.success) {
                // Reload bids to include the new bid
                const updatedBidsResponse = await axios.get(`http://localhost:3000/auctions/${id}/bids`);
                setBids(updatedBidsResponse.data.bids);
                setBidAmount(''); // Reset bid input
            } else {
                setErrorMessage('Failed to place bid.');
            }
        } catch (error) {
            console.error('Error placing bid:', error);
            setErrorMessage('An error occurred while placing the bid.');
        }
    };

    return (
        <div>
            <h2>{auction.itemName}</h2>
            <p>{auction.description}</p>
            <h3>Bids</h3>
            {bids.map((bid, index) => (
                <p key={index}>${bid.bidAmount} - {new Date(bid.timestamp).toLocaleString()}</p>
            ))}
            <h3>Place a Bid</h3>
            <form onSubmit={handleBidSubmit}>
                <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                />
                <button type="submit">Submit Bid</button>
            </form>
            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
}

export default Auction;