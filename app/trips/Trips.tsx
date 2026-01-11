"use client";
import Card from "../wishList/Card";
import { ReservationProps } from "@/types/reservation";

const Trips = ({ result }: { result: ReservationProps }) => {
  return <Card data={result.product} startDay={result.startDay} endDay={result.endDay} disable={true} />;
};

export default Trips;
