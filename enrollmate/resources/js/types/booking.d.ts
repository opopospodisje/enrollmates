
export type OptionType = {
    label: string;
    value: string;
};

export type BookingFormData = {
    booking_range: [Date | null, Date | null];
    client: string | number;
    room_type_id: string | number;
    room: string;
    total_amount: number;
};

export type CreateBookingProps = {
    clients: OptionType[];
    roomTypes: OptionType[];
    rooms: OptionType[];
};
export type Booking = {
    id: number;
    booking_status: string;
    payment_status: string;
    client_name: string;
    room: string;
    amount_paid: number;
    balance: number;
    date_from: string;
    date_to: string;
    is_walk_in: boolean;
    total_amount: number;
    client_email: string;
    client_contact: string;
    identification_type: string;
};

export type BookingIndexProps = {
    bookings: Booking[];
};
