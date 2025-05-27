let web3;
let productContract;

const productContractAddress = "0x79153eF6Ba2CB89a2592eA0289Dc7D8b8895567C";

const productContractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "commenter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "commentText",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "rating",
          "type": "uint8"
        }
      ],
      "name": "CommentAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "name": "ProductAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "keywordIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "products",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "addProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_commentText",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "_rating",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_keyword",
          "type": "string"
        }
      ],
      "name": "addComment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        }
      ],
      "name": "getProduct",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_commentIndex",
          "type": "uint256"
        }
      ],
      "name": "getComment",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_keyword",
          "type": "string"
        }
      ],
      "name": "searchByKeyword",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "totalProducts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

// Minimal ABI - Replace this by compiling your contract and copying ABI here
// For demonstration, use truffle build or remix and paste ABI here.

async function init() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected to MetaMask");
    } catch (error) {
      alert("Please allow MetaMask connection");
      return;
    }
  } else {
    alert("MetaMask not detected. Please install MetaMask.");
    return;
  }

  productContract = new web3.eth.Contract(productContractABI, productContractAddress);
}

async function addProduct() {
  const name = document.getElementById("productName").value;
  const ipfsHash = document.getElementById("productIPFS").value;
  const accounts = await web3.eth.getAccounts();

  productContract.methods.addProduct(name, ipfsHash)
    .send({ from: accounts[0] })
    .then(() => alert("Product added successfully!"))
    .catch(err => alert(err.message));
}

async function addComment() {
  const productId = document.getElementById("commentProductId").value;
  const commentText = document.getElementById("commentText").value;
  const rating = parseInt(document.getElementById("commentRating").value);
  const ipfsHash = document.getElementById("commentIPFS").value;
  const keyword = document.getElementById("commentKeyword").value;
  const accounts = await web3.eth.getAccounts();

  productContract.methods.addComment(productId, commentText, rating, ipfsHash, keyword)
    .send({ from: accounts[0] })
    .then(() => alert("Comment added successfully!"))
    .catch(err => alert(err.message));
}

async function displayAllProducts() {
  const resultsDiv = document.getElementById("searchResults");
  resultsDiv.innerHTML = "Loading all products...";

  try {
    const total = await productContract.methods.totalProducts().call();
    if (total == 0) {
      resultsDiv.innerHTML = "No products found.";
      return;
    }

    let html = "<h3>All Products:</h3><ul>";

    for (let i = 0; i < total; i++) {
      const product = await productContract.methods.getProduct(i).call();
      const name = product[0];
      const ipfsHash = product[1];
      const commentCount = parseInt(product[2]);

      // Calculate average rating
      let totalRating = 0;
      for (let j = 0; j < commentCount; j++) {
        const comment = await productContract.methods.getComment(i, j).call();
        totalRating += parseInt(comment[2]); // rating is at index 2
      }

      const avgRating = commentCount > 0 ? (totalRating / commentCount).toFixed(2) : "N/A";

      html += `<li>
        <strong>Product ID:</strong> ${i}<br />
        <strong>Name:</strong> ${name}<br />
        <strong>IPFS Hash:</strong> ${ipfsHash}<br />
        <strong>Total Comments:</strong> ${commentCount}<br />
        <strong>Average Rating:</strong> ${avgRating}/5<br />
      </li><hr/>`;
    }

    html += "</ul>";
    resultsDiv.innerHTML = html;
  } catch (err) {
    resultsDiv.innerHTML = "Error loading products: " + err.message;
  }
}



window.onload = init;
