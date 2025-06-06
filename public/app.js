let web3;
let productContract;
let accounts;
let currentUserRole = ""; // 'admin' or 'user'
let activeSection = ""; // can be "addProduct" or "viewProducts"
let currentUsername = "";

const productContractAddress =  "0x51d563264122047D374B7C93700CEa8505a54F85"
const productContractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
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
          "internalType": "address",
          "name": "commenter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "commenterId",
          "type": "string"
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
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        }
      ],
      "name": "ProductDeleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "userId",
          "type": "string"
        }
      ],
      "name": "UserRegistered",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "adminAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
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
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "users",
      "outputs": [
        {
          "internalType": "string",
          "name": "userId",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isRegistered",
          "type": "bool"
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
          "name": "_userId",
          "type": "string"
        }
      ],
      "name": "registerUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "loginUser",
      "outputs": [
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
              "internalType": "string",
              "name": "commenterId",
              "type": "string"
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        }
      ],
      "name": "deleteProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
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
  ];

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
window.ethereum.on('accountsChanged', function (newAccounts) {
  accounts = newAccounts;
  console.log('Accounts changed:', accounts);
  // Optionally reset UI or force logout
  logout();
});

function showLogin(role) {
  currentUserRole = role;
  document.getElementById("roleSelectionSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("loginRoleName").innerText = role.charAt(0).toUpperCase() + role.slice(1);

  // Clear fields
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  // Show Register button only for users, not for admin
  document.getElementById("showRegisterBtn").style.display = (role === "user") ? "inline-block" : "none";
  
  // Show login form and hide register form initially
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
}

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";

  // Clear register form fields
  document.getElementById("regUsername").value = "";
  document.getElementById("regPassword").value = "";
}

async function registerUser() {
  const newUsername = document.getElementById("regUsername").value.trim();
  const newPassword = document.getElementById("regPassword").value.trim();

  if (!newUsername || !newPassword) {
    alert("Please enter both username and password for registration.");
    return;
  }

  try {
    // Call the contract method with only username (1 param)
   await productContract.methods.registerUser(newUsername).send({ from: accounts[0] });


    alert("Registration successful! You can now log in.");

    // Optionally clear the form and switch back to login
    document.getElementById("regUsername").value = "";
    document.getElementById("regPassword").value = "";
    showLogin(currentUserRole); // assuming this function switches UI

  } catch (error) {
    console.error("Registration failed:", error);
    alert("Registration failed. See console for details.");
  }
}

function cancelLogin() {
  currentUserRole = "";
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("roleSelectionSection").style.display = "block";
}

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (currentUserRole === "admin") {
    if (username === "admin" && password === "admin123") {
      showDashboard();
    } else {
      alert("Invalid admin credentials");
    }
  } else if (currentUserRole === "user") {
    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

    try {
      // Call loginUser() with no arguments, msg.sender = accounts[0]
      const userId = await productContract.methods.loginUser().call({ from: accounts[0] });

      // Check if returned userId matches username entered
      if (userId === username) {
        currentUsername = username; 
        showDashboard();
      } else {
        alert("Invalid username or user not registered.");
      }
    } catch (error) {
      // This will catch require() failures from Solidity, e.g. user not registered
      alert("Login failed: User not registered or other error.");
      console.error(error);
    }
  }
}

function showDashboard() {
  // Hide login and role selection
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("roleSelectionSection").style.display = "none";

  // Show navbar
  document.getElementById("navbar").style.display = "block";

  // Show or hide Add Product button based on role
  document.getElementById("addProductBtn").style.display = currentUserRole === "admin" ? "inline-block" : "none";

  // Hide all content sections initially
  document.getElementById("adminSection").style.display = "none";
  document.getElementById("productListSection").style.display = "none";
  document.getElementById("homeSection").style.display = "none";

  // Show home on dashboard load
  goHome();

  // Update username display on navbar if any
  const navUsernameElem = document.getElementById("navUsername");
  if (navUsernameElem) {
    navUsernameElem.innerText = currentUsername;
  }
}

function goHome() {
  // Hide all sections
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");

  // Show home section with welcome message
  const welcomeMsg = `Welcome ${currentUsername} to the Product Rating Review System`;
  const welcomeElem = document.getElementById("welcomeMessage");
  if (welcomeElem) {
    welcomeElem.innerText = welcomeMsg;
  }

  document.getElementById("homeSection").style.display = "block";
  document.getElementById("navbar").style.display = "block";
  document.getElementById("productListSection").style.display = "none";
  document.getElementById("adminSection").style.display = "none";

  window.scrollTo({ top: 0, behavior: "smooth" });
}


function showAddProduct() {
  // Hide all main content sections first
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("productListSection").style.display = "none";

  // Show admin section (add product)
  document.getElementById("adminSection").style.display = "block";
}

function handleViewProducts() {
  // Hide other content sections
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("adminSection").style.display = "none";

  // Show product list section
  document.getElementById("productListSection").style.display = "block";
  // Load product list if needed
  loadProducts();
}

function logout() {
  currentUserRole = "";
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("adminSection").style.display = "none";
  document.getElementById("productListSection").style.display = "none";
  document.getElementById("logoutSection").style.display = "none";
  document.getElementById("navbar").style.display = "none";
  document.getElementById("loginSection").style.display = "none";
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
          <button onclick="deleteProduct(${id})" style="color: red; margin-top: 10px;">Delete Product</button>
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
  try {
    const comments = await productContract.methods.getComments(id).call();
    const container = document.getElementById(`comments-${id}`);
    container.innerHTML = "<strong>Reviews:</strong><br>";
    comments.forEach(c => {
    container.innerHTML += `<p><b>${c.commenterId}</b>: ${c.text} [Rating: ${c.rating}]</p>`;
  });

  } catch (error) {
    console.error("Failed to load comments:", error);
  }
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    // Get current user's connected account from web3
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];

    // Call the deleteProduct method with the current user's account
    await productContract.methods.deleteProduct(id).send({ from: userAccount });

    alert("Product deleted successfully.");
    await loadProducts();
  } catch (error) {
    alert("Failed to delete product. See console for details.");
    console.error(error);
  }
}



