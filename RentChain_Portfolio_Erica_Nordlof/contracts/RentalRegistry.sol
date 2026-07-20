// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title RentalRegistry
 * @notice Portfolio smart contract for tamper-evident rental booking proofs.
 * @dev The contract stores only a cryptographic hash, not personal booking data.
 */
contract RentalRegistry {
    enum RentalStatus {
        Created,
        Active,
        Returned,
        Completed,
        Disputed
    }

    struct Rental {
        uint256 id;
        address customer;
        bytes32 bookingHash;
        uint256 deposit;
        RentalStatus status;
        uint64 createdAt;
    }

    address public immutable provider;
    uint256 public nextRentalId = 1;
    bool private locked;

    mapping(uint256 => Rental) private rentals;
    mapping(bytes32 => bool) public registeredHashes;

    event RentalCreated(
        uint256 indexed rentalId,
        address indexed customer,
        bytes32 indexed bookingHash,
        uint256 deposit
    );
    event RentalStatusChanged(uint256 indexed rentalId, RentalStatus status);
    event DepositReleased(uint256 indexed rentalId, address indexed customer, uint256 amount);

    error OnlyProvider();
    error OnlyCustomer();
    error RentalNotFound();
    error InvalidState();
    error HashAlreadyRegistered();
    error ZeroHash();
    error TransferFailed();
    error Reentrancy();

    modifier onlyProvider() {
        if (msg.sender != provider) revert OnlyProvider();
        _;
    }

    modifier nonReentrant() {
        if (locked) revert Reentrancy();
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        provider = msg.sender;
    }

    function createRental(bytes32 bookingHash) external payable returns (uint256 rentalId) {
        if (bookingHash == bytes32(0)) revert ZeroHash();
        if (registeredHashes[bookingHash]) revert HashAlreadyRegistered();

        rentalId = nextRentalId++;
        rentals[rentalId] = Rental({
            id: rentalId,
            customer: msg.sender,
            bookingHash: bookingHash,
            deposit: msg.value,
            status: RentalStatus.Created,
            createdAt: uint64(block.timestamp)
        });
        registeredHashes[bookingHash] = true;

        emit RentalCreated(rentalId, msg.sender, bookingHash, msg.value);
    }

    function activateRental(uint256 rentalId) external onlyProvider {
        Rental storage rental = _getRental(rentalId);
        if (rental.status != RentalStatus.Created) revert InvalidState();
        rental.status = RentalStatus.Active;
        emit RentalStatusChanged(rentalId, RentalStatus.Active);
    }

    function markReturned(uint256 rentalId) external onlyProvider {
        Rental storage rental = _getRental(rentalId);
        if (rental.status != RentalStatus.Active) revert InvalidState();
        rental.status = RentalStatus.Returned;
        emit RentalStatusChanged(rentalId, RentalStatus.Returned);
    }

    function completeRental(uint256 rentalId) external onlyProvider nonReentrant {
        Rental storage rental = _getRental(rentalId);
        if (rental.status != RentalStatus.Returned) revert InvalidState();

        rental.status = RentalStatus.Completed;
        uint256 amount = rental.deposit;
        rental.deposit = 0;

        emit RentalStatusChanged(rentalId, RentalStatus.Completed);

        if (amount > 0) {
            (bool success, ) = payable(rental.customer).call{value: amount}("");
            if (!success) revert TransferFailed();
            emit DepositReleased(rentalId, rental.customer, amount);
        }
    }

    function disputeRental(uint256 rentalId) external {
        Rental storage rental = _getRental(rentalId);
        if (msg.sender != provider && msg.sender != rental.customer) revert OnlyCustomer();
        if (
            rental.status != RentalStatus.Created &&
            rental.status != RentalStatus.Active &&
            rental.status != RentalStatus.Returned
        ) revert InvalidState();

        rental.status = RentalStatus.Disputed;
        emit RentalStatusChanged(rentalId, RentalStatus.Disputed);
    }

    function getRental(uint256 rentalId) external view returns (Rental memory) {
        return _getRental(rentalId);
    }

    function verifyHash(bytes32 bookingHash) external view returns (bool) {
        return registeredHashes[bookingHash];
    }

    function _getRental(uint256 rentalId) internal view returns (Rental storage rental) {
        rental = rentals[rentalId];
        if (rental.id == 0) revert RentalNotFound();
    }
}
