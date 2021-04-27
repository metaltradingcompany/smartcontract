pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "./BaseConstants.sol";

/// @title Base Metal Trading Company Smart Contract
contract MetalTradingCompanySmartContract is ERC20PresetMinterPauserUpgradeSafe, BaseConstants, OwnableUpgradeSafe {

    // Modifiers

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "MetalTradingCompanySmartContract: Only approved card minter");
        _;
    }

    modifier onlyOwnerOrAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "MetalTradingCompanySmartContract: Only owner or admin user");
        _;
    }

    modifier onlyApproved(){
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(MINTER_ROLE, msg.sender), "MetalTradingCompanySmartContract: Only approved user");
        _;
    }

    // Functions

    /// @dev Contract initialize function
    function init() public initializer {

        /// @dev test data

        OWNER = msg.sender;
        ADMIN = msg.sender;

        /// @dev Init access control
        __Ownable_init();
        __AccessControl_init_unchained();

        /// @dev Setup contract roles
        _setupRole(DEFAULT_ADMIN_ROLE, ADMIN);
        _setupRole(DEFAULT_ADMIN_ROLE, OWNER);
        _setupRole(MINTER_ROLE, OWNER);
        _setupRole(MINTER_ROLE, ADMIN);

        /// @dev init ERC20
        __ERC20PresetMinterPauser_init(NAME, SYMBOL);
        _setupDecimals(DECIMALS);

        /// @dev mint new tokens for owner wallet
        _mint(OWNER, TOTAL_SUPPLY);
        _approve(OWNER, OWNER, TOTAL_SUPPLY);
        _approve(OWNER, ADMIN, TOTAL_SUPPLY);

        /// @dev Transfer ownership from msg.sender address to OWNER
        transferOwnership(OWNER);
    }

    /// @dev Create tokens on owner address
    function addTokens(uint256 amount) public onlyOwnerOrAdmin {
        _mint(owner(), amount);
    }

}
