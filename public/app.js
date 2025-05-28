let web3;
let productContract;
let accounts;
let currentUserRole = ""; // 'admin' or 'user'

const productContractAddress = "0x891bc71732cbBe88464f891061926f247b0d9d55";
const productContractABI =[
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
          "name": "text",
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
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "ProductAdded",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "productCount",
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
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "imageBase64",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalRating",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "ratingCount",
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
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_imageBase64",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
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
          "name": "_text",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "_rating",
          "type": "uint8"
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
      "name": "getComments",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "commenter",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "text",
              "type": "string"
            },
            {
              "internalType": "uint8",
              "name": "rating",
              "type": "uint8"
            }
          ],
          "internalType": "struct ProductContract.Comment[]",
          "name": "",
          "type": "tuple[]"
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
        }
      ],
      "name": "getAverageRating",
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
      "inputs": [],
      "name": "getAllProducts",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "string[]",
          "name": "names",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "descriptions",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "imageBase64s",
          "type": "string[]"
        },
        {
          "internalType": "address[]",
          "name": "creators",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "avgRatings",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "prices",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]; // ← Paste full ABI here after compiling ProductContract.sol

window.addEventListener('load', async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      accounts = await web3.eth.getAccounts();
      productContract = new web3.eth.Contract(productContractABI, productContractAddress);
      console.log("Contract initialized");
    } catch (error) {
      alert("Please allow access to MetaMask accounts.");
      console.error(error);
    }
  } else {
    alert("Please install MetaMask.");
  }
});

// Show login page after selecting role
function showLogin(role) {
  currentUserRole = role;
  document.getElementById("roleSelectionSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("loginRoleName").innerText = role.charAt(0).toUpperCase() + role.slice(1);
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

// Cancel login, back to role selection
function cancelLogin() {
  currentUserRole = "";
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("roleSelectionSection").style.display = "block";
}

// Login function with simple hardcoded check
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (currentUserRole === "admin") {
    if (username === "admin" && password === "admin123") {
      showDashboard();
    } else {
      alert("Invalid admin credentials");
    }
  } else if (currentUserRole === "user") {
    if (username && password) { // For demo, accept any non-empty user login
      showDashboard();
    } else {
      alert("Invalid user credentials");
    }
  }
}

// Show dashboard after login
function showDashboard() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("roleSelectionSection").style.display = "none";

  if (currentUserRole === "admin") {
    document.getElementById("adminSection").style.display = "block";
  } else {
    document.getElementById("adminSection").style.display = "none";
  }

  document.getElementById("productListSection").style.display = "block";
  document.getElementById("logoutSection").style.display = "block";

  loadProducts();
}

// Logout function
function logout() {
  currentUserRole = "";
  document.getElementById("adminSection").style.display = "none";
  document.getElementById("productListSection").style.display = "none";
  document.getElementById("logoutSection").style.display = "none";
  document.getElementById("loginSection").style.display = "none";

  // Go back to role selection
  document.getElementById("roleSelectionSection").style.display = "block";
}

async function addProduct() {
  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDesc").value;
  const price = document.getElementById("productPrice").value;
  const imageFile = document.getElementById("productImage").files[0];

  if (!name || !desc || !price || !imageFile) {
    alert("Please fill all fields and choose an image.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result.split(',')[1];
    try {
      await productContract.methods.addProduct(name, desc, base64Image, price)
        .send({ from: accounts[0] });
      alert("Product added!");
      await loadProducts();
    } catch (error) {
      alert("Failed to add product. See console for details.");
      console.error(error);
    }
  };
  reader.readAsDataURL(imageFile);
}

async function loadProducts() {
  try {
    const result = await productContract.methods.getAllProducts().call();

    const ids = result[0];
    const names = result[1];
    const descriptions = result[2];
    const imageBase64s = result[3];
    const creators = result[4];
    const avgRatings = result[5];
    const prices = result[6];

    const container = document.getElementById("products");
    container.innerHTML = "";

    ids.forEach((id, index) => {
      const div = document.createElement("div");
      div.className = "product";
      let content = `
        <h3>${names[index]}</h3>
        <img src="data:image/png;base64,${imageBase64s[index]}" alt="Product Image" />
        <p>${descriptions[index]}</p>
        <p><strong>Price:</strong> ${prices[index]} ETH</p>
        <p class="rating">Average Rating: ${avgRatings[index]}</p>
        <button onclick="loadComments(${id})">Show Reviews</button>
        <div id="comments-${id}"></div>
      `;

      if (currentUserRole === "user") {
        content += `
          <textarea id="comment-${id}" placeholder="Add a comment..."></textarea>
          <input type="number" id="rating-${id}" min="1" max="5" placeholder="Rating (1-5)" />
          <button onclick="addComment(${id})">Submit Review</button>
        `;
      }
      if (currentUserRole === "admin") {
        content += `
          <button onclick="deleteProduct(${Number(id)})" style="color: red; margin-top: 10px;">Delete Product</button>
        `;
      }

      div.innerHTML = content;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

async function addComment(id) {
  const text = document.getElementById(`comment-${id}`).value;
  const rating = parseInt(document.getElementById(`rating-${id}`).value);
  if (!text || isNaN(rating)) {
    alert("Comment and rating required");
    return;
  }
  try {
    await productContract.methods.addComment(id, text, rating)
      .send({ from: accounts[0] });
    alert("Comment added!");
    await loadProducts();
  } catch (error) {
    alert("Failed to add comment. See console for details.");
    console.error(error);
  }
}

async function loadComments(id) {
  console.log("Loading comments for product id:", id);
  const productId = Number(id);
  try {
    const result = await productContract.methods.getComments(productId).call();
    console.log("Comments result:", result);

    const commenters = result[0];
    const texts = result[1];
    const ratings = result[2];

    const container = document.getElementById(`comments-${productId}`);
    if (!commenters.length) {
      container.innerHTML = "<strong>No reviews yet.</strong>";
      return;
    }

    let html = "<strong>Reviews:</strong><br>";

    for (let i = 0; i < commenters.length; i++) {
      html += `<p><b>${commenters[i]}</b>: ${texts[i]} [Rating: ${ratings[i]}]</p>`;
    }

    container.innerHTML = html;
  } catch (error) {
    console.error("Failed to load comments:", error);
  }
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await productContract.methods.deleteProduct(id).send({ from: accounts[0] });
    alert("Product deleted successfully.");
    await loadProducts();  // Refresh product list
  } catch (error) {
    alert("Failed to delete product. See console for details.");
    console.error(error);
  }
}
