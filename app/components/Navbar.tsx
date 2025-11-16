import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 left-0 right-0 h-[72px] w-full xxl:h-[80px] xxl:px-[80px] xxl:py-[28px] border-[#151024] xxl:border-b-[1px] bg-[#121212]/50 backdrop-blur-[20px] flex justify-between items-center px-[20px] py-[24px]">
      <Link className="flex gap-[6px]" href="/">
        <Image
          src="/icons/logo.png"
          width="24"
          height="24"
          alt="logo.png"
        ></Image>
        <p className="hidden xxl:block font-bold">
          <em>Dev</em>Event
        </p>
      </Link>

      <div className="flex gap-[16px] xxl:gap-[24px]">
        <Link href="/">Home</Link>
        <Link href="/">Events</Link>
        <Link href="/">Create Event</Link>
      </div>
    </nav>
  );
}
