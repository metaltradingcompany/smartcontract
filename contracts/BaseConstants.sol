pragma solidity ^0.6.0;

/// @title Base contract variables
contract BaseConstants {

    /// @dev Contract owner address
    address internal OWNER = address(0x0);

    /// @dev Contract admin address
    address internal ADMIN = address(0x0);

    /// @dev Contract name
    string internal NAME = "Metal Trading Company";

    /// @dev Contract symbol
    string internal SYMBOL = "MTC";

    /// @dev Contract decimals
    uint8 internal DECIMALS = 4;

    /// @dev Contract total supply
    uint256 internal TOTAL_SUPPLY = 100000000;
}
