import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AuctionList() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/auctions')
      .then(response => {
        setAuctions(response.data.auctions);
      })
      .catch(error => console.error("There was an error retrieving the auctions: ", error));
  }, []);

  return (
    <div>
      <h2>Auctions</h2>
      <ul>
        {auctions.map(auction => (
          <li key={auction._id}>{auction.itemName}</li>
        ))}
      </ul>
    </div>
  );
}

export default AuctionList;