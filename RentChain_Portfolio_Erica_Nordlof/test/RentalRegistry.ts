import { expect } from "chai";
import { ethers } from "hardhat";

function bookingHash(value: string) {
  return ethers.keccak256(ethers.toUtf8Bytes(value));
}

describe("RentalRegistry", function () {
  async function deployFixture() {
    const [provider, customer, stranger] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("RentalRegistry", provider);
    const registry = await Factory.deploy();
    await registry.waitForDeployment();
    return { registry, provider, customer, stranger };
  }

  it("creates a rental with a unique booking hash and deposit", async function () {
    const { registry, customer } = await deployFixture();
    const hash = bookingHash("booking-001");
    const deposit = ethers.parseEther("0.01");

    await expect(registry.connect(customer).createRental(hash, { value: deposit }))
      .to.emit(registry, "RentalCreated")
      .withArgs(1n, customer.address, hash, deposit);

    const rental = await registry.getRental(1);
    expect(rental.customer).to.equal(customer.address);
    expect(rental.bookingHash).to.equal(hash);
    expect(rental.deposit).to.equal(deposit);
    expect(await registry.verifyHash(hash)).to.equal(true);
  });

  it("prevents duplicate booking hashes", async function () {
    const { registry, customer } = await deployFixture();
    const hash = bookingHash("same-booking");

    await registry.connect(customer).createRental(hash);
    await expect(registry.connect(customer).createRental(hash))
      .to.be.revertedWithCustomError(registry, "HashAlreadyRegistered");
  });

  it("enforces the lifecycle and returns the deposit on completion", async function () {
    const { registry, provider, customer } = await deployFixture();
    const hash = bookingHash("booking-002");
    const deposit = ethers.parseEther("0.02");

    await registry.connect(customer).createRental(hash, { value: deposit });
    await registry.connect(provider).activateRental(1);
    await registry.connect(provider).markReturned(1);

    const before = await ethers.provider.getBalance(customer.address);
    await registry.connect(provider).completeRental(1);
    const after = await ethers.provider.getBalance(customer.address);

    const rental = await registry.getRental(1);
    expect(rental.status).to.equal(3n);
    expect(rental.deposit).to.equal(0n);
    expect(after - before).to.equal(deposit);
  });

  it("blocks non-provider lifecycle changes", async function () {
    const { registry, customer, stranger } = await deployFixture();
    const hash = bookingHash("booking-003");

    await registry.connect(customer).createRental(hash);
    await expect(registry.connect(stranger).activateRental(1))
      .to.be.revertedWithCustomError(registry, "OnlyProvider");
  });
});
