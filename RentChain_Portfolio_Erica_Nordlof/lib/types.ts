export type RentalStatus =
  | "Created"
  | "Active"
  | "Returned"
  | "Completed"
  | "Disputed";

export type DemoRental = {
  id: string;
  customerName: string;
  itemName: string;
  startDate: string;
  endDate: string;
  bookingHash: string;
  status: RentalStatus;
  transactionHash?: string;
  createdAt: string;
};
