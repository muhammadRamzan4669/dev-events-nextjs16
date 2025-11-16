import Image from "next/image";

export default function ExploreBtn() {
  return (
    <button className="w-full xxl:w-[200px] flex justify-center bg-[#0D161A] py-[14px] px-[30px] border-[1px] rounded-[9999px] border-[#182830] items-center font-[500] gap-[4px]">
      Explore Events
      <Image
        src="icons/arrow-down.svg"
        width="20"
        height="20"
        alt="arrow-down"
      ></Image>
    </button>
  );
}
