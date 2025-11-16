import Image from "next/image";
import Link from "next/link";
import { Event } from "@/lib/constants";

export default function EventCard({ event }: { event: Event }) {
  return (
    <article className="flex flex-col gap-[16px]">
      {/* wraper div */}
      <div className="relative w-fit">
        <Image
          src={event.image}
          width="400"
          height="300"
          alt={`event${event.id}`}
          className="rounded-[15px] object-cover w-full aspect-[4/3] "
        ></Image>
        <Image
          src="/icons/favourite.svg"
          width="24"
          height="24"
          alt="favourite"
          className="absolute top-[10px] right-[10px]"
        ></Image>
      </div>
      <div className="flex flex-col gap-[12px]">
        <address className="font-mono flex gap-[4px] not-italic text-[14px] font-light">
          <Image src="/icons/pin.svg" width="18" height="18" alt="pin"></Image>
          {event.location}
        </address>
        <h3 className="font-semibold text-[20px]">
          <Link href="/">{event.title}</Link>
        </h3>
        <div className="flex text-[14px] font-light gap-[16px]">
          <time dateTime="2025-10-28" className="flex gap-[6px]">
            <Image
              src="/icons/calendar.svg"
              width="18"
              height="18"
              alt="calendar"
            ></Image>
            {event.date}
          </time>
          <time
            dateTime="PT2H15M"
            className="flex gap-[6px] pl-[16px] border-[BDBDBD]/50 border-l-[0.5px]"
          >
            <Image
              src="/icons/clock.svg"
              width="18"
              height="18"
              alt="clock"
            ></Image>
            {event.time}
          </time>
        </div>
      </div>
    </article>
  );
}
