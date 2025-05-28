let web3;
let productContract;
let accounts;
let currentUserRole = ""; // 'admin' or 'user'

const productContractAddress =  "0x90d43b78bCD79BD41459e7D331C2564042498e8F"
const productContractABI = [
  // 🔁 Paste full ABI from ProductContract.sol compilation output here
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

function showLogin(role) {
  currentUserRole = role;
  document.getElementById("roleSelectionSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("loginRoleName").innerText = role.charAt(0).toUpperCase() + role.slice(1);
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function cancelLogin() {
  currentUserRole = "";
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("roleSelectionSection").style.display = "block";
}

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
    if (username && password) {
      showDashboard();
    } else {
      alert("Invalid user credentials");
    }
  }
}

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

function logout() {
  currentUserRole = "";
  document.getElementById("adminSection").style.display = "none";
  document.getElementById("productListSection").style.display = "none";
  document.getElementById("logoutSection").style.display = "none";
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
      container.innerHTML += `<p><b>${c.commenter}</b>: ${c.text} [Rating: ${c.rating}]</p>`;
    });
  } catch (error) {
    console.error("Failed to load comments:", error);
  }
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await productContract.methods.deleteProduct(id).send({ from: accounts[0] });
    alert("Product deleted successfully.");
    await loadProducts();
  } catch (error) {
    alert("Failed to delete product. See console for details.");
    console.error(error);
  }
}
