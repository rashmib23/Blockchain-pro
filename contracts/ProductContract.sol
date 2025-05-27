// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductContract {
    struct Comment {
        address commenter;
        string commentText;
        uint8 rating; // 1-5
        string ipfsHash;
    }

    struct Product {
        string name;
        string ipfsHash; // product info stored on IPFS (simulate with a string)
        Comment[] comments;
    }

    Product[] public products;

    // keyword => list of comment indexes (simulate simple keyword mapping)
    mapping(string => uint[]) public keywordIndex;

    event ProductAdded(uint productId, string name, string ipfsHash);
    event CommentAdded(uint productId, address commenter, string commentText, uint8 rating);

    function addProduct(string memory _name, string memory _ipfsHash) public {
        products.push();
        uint productId = products.length - 1;
        Product storage p = products[productId];
        p.name = _name;
        p.ipfsHash = _ipfsHash;
        emit ProductAdded(productId, _name, _ipfsHash);
    }

    function addComment(uint _productId, string memory _commentText, uint8 _rating, string memory _ipfsHash, string memory _keyword) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        Product storage p = products[_productId];
        p.comments.push(Comment(msg.sender, _commentText, _rating, _ipfsHash));
        uint commentIndex = p.comments.length - 1;
        keywordIndex[_keyword].push(_productId * 1000 + commentIndex); // simple way to store ref
        emit CommentAdded(_productId, msg.sender, _commentText, _rating);
    }

    function getProduct(uint _productId) public view returns (string memory, string memory, uint) {
        Product storage p = products[_productId];
        return (p.name, p.ipfsHash, p.comments.length);
    }

    function getComment(uint _productId, uint _commentIndex) public view returns (address, string memory, uint8, string memory) {
        Comment storage c = products[_productId].comments[_commentIndex];
        return (c.commenter, c.commentText, c.rating, c.ipfsHash);
    }

    function searchByKeyword(string memory _keyword) public view returns (uint[] memory) {
        return keywordIndex[_keyword];
    }

    function totalProducts() public view returns (uint) {
        return products.length;
    }
}
