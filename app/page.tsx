import ExploreBtn from "./components/ExploreBtn.tsx";
import EventCard from "./components/EventCard.tsx";
import { events, Event } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-[20px] items-center xxl:gap-[30px] text-center">
        <h1 className="text-[40px] font-semibold font-sans xxl:text-[64px] leading-tight">
          The Hub for Every Dev
          <br />
          Event You Can't Miss
        </h1>
        <p className="text-[14px] xxl:text-[18px]  font-normal leading-tight">
          Hackathons, Meetups, and Conferences, All in One Place
        </p>
        <ExploreBtn />
      </main>
      <content className="flex flex-col w-[400px] xxl:w-[1280px] xxl:grid xxl:grid-cols-3 gap-[24px]">
        <h3 className="text-[20px] xxl:text-[24px] font-[700] xxl:col-span-3 w-full">
          Featured Events
        </h3>

        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </content>
    </>
  );
}
