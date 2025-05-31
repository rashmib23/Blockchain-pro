# Product Review & Rating System on Blockchain

A decentralized application (dApp) on Ethereum that enables **transparent, immutable, and trustable product reviews and ratings**. Using smart contracts, it guarantees that product feedback cannot be tampered with, fostering fair evaluations.

---


##  Features

### Role-Based Access Control
- **Admin**: Add or delete products.  
- **User**: Browse products, post reviews, and rate products.

### Product Management
- Add products with name, description, price (in Wei), and image (base64).  
- Admin only controls product deletion.

### Decentralized Reviews & Ratings
- Users can leave comments and rate products on a 1–5 scale.  
- Ratings and reviews are permanently stored on the Ethereum blockchain.

### Real-Time Product Info
- Products show ID, name, description, price, image, creator, and average rating.  
- Ratings and comments fetched live from blockchain.

### MetaMask Authentication
- Connect via MetaMask wallet for login/registration.  
- Roles assigned via UI; no centralized database needed.

---

##  How It Works

1. **Connect MetaMask** wallet to the dApp.  
2. **Select Role:** Choose between Admin or User.  
3. **Register or Login:** Register on-chain if new, or login if already registered.  
4. **Admin Panel:** Add or remove products.  
5. **User Panel:** Browse products, add comments, and rate products.  
6. **Blockchain Transactions:** Every action (add product/comment, delete product) triggers Ethereum transactions via smart contract.

---

##  Tech Stack

| Component        | Technology                  |
|------------------|-----------------------------|
| Blockchain       | Ethereum, Solidity          |
| Frontend         | HTML, JavaScript            |
| Blockchain API   | Web3.js                    |
| Wallet           | MetaMask                   |
| Development      | Ganache    |

---

## Getting Started

### Prerequisites

Make sure you have installed the following:

- **MetaMask Browser Extension**: [Install MetaMask](https://metamask.io/)  
- **Node.js** : [Download Node.js](https://nodejs.org/)  
- **Ganache**  for local Ethereum network

---

 **Clone the repo**  
   ```bash
   git clone https://github.com/rashmib23/Blockchain-product-rating-review-system.git
 
