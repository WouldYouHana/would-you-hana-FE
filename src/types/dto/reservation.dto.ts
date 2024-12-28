export interface ReservationResponseDTO{
    customerName: string;
    branchName: string;
    rdayTime: string;
    bankerName: string;
}

export interface ReservationRequestDTO{
    customerId: number;
    branchName: string;
    reservationDate: string;
    bankerName: string;
}