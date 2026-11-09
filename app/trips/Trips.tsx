"use client";
import Card from "../wishList/Card";
import { ReservationProps } from "@/types/reservation";
import ContactHostButton from "@/app/messages/components/ContactHostButton";

const Trips = ({ result, reservationId, currentUserEmail }: { result: ReservationProps; reservationId?: string; currentUserEmail?: string }) => {
  return <div>
    <Card data={result.product} startDay={result.startDay} endDay={result.endDay} disable={true} />
    {reservationId && currentUserEmail && <ContactHostButton reservationId={reservationId} email={currentUserEmail} />}
  </div>;
};

export default Trips;
