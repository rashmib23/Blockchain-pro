const ProductContract = artifacts.require("ProductContract");
const AuxiliaryContract = artifacts.require("AuxiliaryContract");

module.exports = function (deployer) {
  deployer.deploy(ProductContract);
  deployer.deploy(AuxiliaryContract);
};
