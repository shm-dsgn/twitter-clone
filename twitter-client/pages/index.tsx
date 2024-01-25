import { Inter } from "next/font/google";
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
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { useCallback } from "react";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";

const inter = Inter({ subsets: ["latin"] });

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

interface VerifyGoogleTokenResult {
  verifyGoogleToken: string;
}

export default function Home() {
  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      //console.log(cred)
      const googleToken = cred.credential;
      //console.log(googleToken);
      if (!googleToken) return toast.error("Google Token not Failed");


      //some error is happening here
      const { verifyGoogleToken } = await graphqlClient.request<VerifyGoogleTokenResult>(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      //console.log(verifyGoogleToken);

      toast.success("Verification Success");

      if(verifyGoogleToken) window.localStorage.setItem("__twitter_token", verifyGoogleToken);
    },
    []
  );

  return (
    <div className={inter.className}>
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
          <div className="pt-8 pl-8">
            <h1 className="mt-4 text-lg font-normal">New here?</h1>
            <h4 className="mb-4 text-sm font-normal">Sign In with Google</h4>
            <GoogleLogin
              onSuccess={handleLoginWithGoogle}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
