// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductContract {
    struct Comment {
        address commenter;
        string text;
        uint8 rating;
    }

    struct Product {
        uint256 id;
        string name;
        string description;
        string imageBase64; // storing image in base64
        address creator;
        uint256 price;
        uint256 totalRating;
        uint256 ratingCount;
        Comment[] comments;
    }

    uint256 public productCount = 0;
    mapping(uint256 => Product) public products;

    address public adminAddress;

    event ProductAdded(uint256 id, string name);
    event CommentAdded(uint256 productId, address commenter, string text, uint8 rating);
    event ProductDeleted(uint256 productId);

    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Only admin can call this");
        _;
    }

    constructor() {
        adminAddress = msg.sender;  // The deployer is admin
    }

    // Add a new product
    function addProduct(
        string memory _name,
        string memory _description,
        string memory _imageBase64,
        uint256 _price
    ) public {
        Product storage newProduct = products[productCount];
        newProduct.id = productCount;
        newProduct.name = _name;
        newProduct.description = _description;
        newProduct.imageBase64 = _imageBase64;
        newProduct.creator = msg.sender;
        newProduct.price = _price;

        emit ProductAdded(productCount, _name);
        productCount++;
    }

    // Add a comment and rating to a product
    function addComment(
        uint256 _productId,
        string memory _text,
        uint8 _rating
    ) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        require(_productId < productCount, "Invalid productId");

        Product storage product = products[_productId];
        product.comments.push(Comment(msg.sender, _text, _rating));
        product.totalRating += _rating;
        product.ratingCount++;

        emit CommentAdded(_productId, msg.sender, _text, _rating);
    }

    // Get all comments for a product
    function getComments(uint256 _productId)
        public
        view
        returns (
            address[] memory commenters,
            string[] memory texts,
            uint8[] memory ratings
        )
    {
        require(_productId < productCount, "Invalid productId");

        Product storage product = products[_productId];
        uint256 len = product.comments.length;

        commenters = new address[](len);
        texts = new string[](len);
        ratings = new uint8[](len);

        for (uint256 i = 0; i < len; i++) {
            commenters[i] = product.comments[i].commenter;
            texts[i] = product.comments[i].text;
            ratings[i] = product.comments[i].rating;
        }
    }

    // Get average rating of a product
    function getAverageRating(uint256 _productId) public view returns (uint256) {
        require(_productId < productCount, "Invalid productId");

        Product storage product = products[_productId];
        if (product.ratingCount == 0) return 0;
        return product.totalRating / product.ratingCount;
    }

    // Delete product (admin only)
    function deleteProduct(uint256 _productId) public onlyAdmin {
        require(_productId < productCount, "Invalid productId");

        delete products[_productId];
        emit ProductDeleted(_productId);
    }

    // Get all products (excluding comments)
    function getAllProducts()
        public
        view
        returns (
            uint256[] memory ids,
            string[] memory names,
            string[] memory descriptions,
            string[] memory imageBase64s,
            address[] memory creators,
            uint256[] memory avgRatings,
            uint256[] memory prices
        )
    {
        ids = new uint256[](productCount);
        names = new string[](productCount);
        descriptions = new string[](productCount);
        imageBase64s = new string[](productCount);
        creators = new address[](productCount);
        avgRatings = new uint256[](productCount);
        prices = new uint256[](productCount);

        for (uint256 i = 0; i < productCount; i++) {
            Product storage p = products[i];
            ids[i] = p.id;
            names[i] = p.name;
            descriptions[i] = p.description;
            imageBase64s[i] = p.imageBase64;
            creators[i] = p.creator;
            avgRatings[i] = p.ratingCount == 0 ? 0 : (p.totalRating / p.ratingCount);
            prices[i] = p.price;
        }
    }
}
