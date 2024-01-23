import Image from "next/image";
import {
  Bell,
  Hash,
  House,
  TwitterLogo,
  EnvelopeSimple,
  BookmarkSimple,
  User,
  DotsThree,
} from "@phosphor-icons/react/dist/ssr";
import FeedCard from "@/components/FeedCard/FeedCard";
import GoogleAuthButton from "@/components/GoogleAuthButton/GoogleAuthButton";

interface TwitterSideBarButton {
  icon: React.ReactNode;
  title: string;
}

const sideBarMenu: TwitterSideBarButton[] = [
  {
    icon: <House size={24} />,
    title: "Home",
  },
  {
    icon: <Hash size={24} />,
    title: "Explore",
  },
  {
    icon: <Bell size={24} />,
    title: "Notifications",
  },
  {
    icon: <EnvelopeSimple size={24} />,
    title: "Messages",
  },
  {
    icon: <BookmarkSimple size={24} />,
    title: "Bookmarks",
  },
  {
    icon: <User size={24} />,
    title: "Profile",
  },
  {
    icon: <DotsThree size={24} />,
    title: "More",
  },
];

export default function Home() {
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 flex justify-start p-8 flex-col">
          <div className="hover:bg-gray-900 cursor-pointer transition-all rounded-full p-3 h-fit w-fit mb-6">
            <TwitterLogo size={32} weight="fill" />
          </div>
          <div>
            {sideBarMenu.map((item) => (
              <div
                className="flex items-center gap-4 p-3 hover:bg-gray-900 cursor-pointer transition-all rounded-full h-fit w-fit"
                key={item.title}
              >
                {item.icon}
                <p className="text-lg font-normal">{item.title}</p>
              </div>
            ))}
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 transition-all rounded-full p-3 h-fit w-full text-white font-semibold mt-8">
            Tweet
          </button>
        </div>
        <div className="col-span-6 border-x-[0.5px] border-gray-800 h-screen overflow-y-scroll no-scrollbar">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3">
          <GoogleAuthButton />
      </div>
    </div>
    </div>
  );
}
