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
  ImageSquare,
} from "@phosphor-icons/react/dist/ssr";
import FeedCard from "@/components/FeedCard/FeedCard";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { useCallback, useContext } from "react";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

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
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.click();
  }, []);

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error("Google Token not Failed");

      const { verifyGoogleToken } =
        await graphqlClient.request<VerifyGoogleTokenResult>(
          verifyUserGoogleTokenQuery,
          { token: googleToken }
        );

      toast.success("Verification Success");

      if (verifyGoogleToken)
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);

      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    [queryClient]
  );

  return (
    <div className={inter.className}>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 flex justify-start p-8 flex-col relative">
          <div className="hover:bg-gray-900 cursor-pointer transition-all rounded-full p-3 h-fit w-fit mb-2">
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
          <button className="bg-blue-500 hover:bg-blue-600 transition-all rounded-full p-3 h-fit w-full text-white font-semibold mt-4">
            Tweet
          </button>

          {user && (
            <div className="flex items-center gap-4 p-3 hover:bg-gray-900 cursor-pointer transition-all rounded-full h-fit w-fit absolute bottom-2">
              <Image
                src={
                  user?.profileImageURL ||
                  "https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png"
                }
                alt="profile"
                className="rounded-full"
                width={36}
                height={36}
              />
              <div className="flex flex-col">
                <p className="text-sm font-normal">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-6 border-x-[0.5px] border-gray-800 h-screen overflow-y-scroll no-scrollbar">
          <div>
            <div className="border border-x-0 border-b-0 border-gray-900 p-4 ">
              <div className="grid grid-cols-12">
                <div className="col-span-1">
                  {user?.profileImageURL && (
                    <Image
                      src={user?.profileImageURL}
                      alt="profile"
                      className="rounded-full"
                      height={50}
                      width={50}
                    />
                  )}
                </div>
                <div className="col-span-11 pl-4">
                  <textarea
                    className=" w-full bg-transparent focus:outline-none border-b-2 border-slate-700"
                    rows={3}
                    placeholder="What's happening?"
                  ></textarea>
                  <div className="text-blue-500 flex justify-between items-center">
                    <div className="p-2 hover:bg-gray-900 cursor-pointer transition-all rounded-full h-fit w-fit" onClick={handleSelectImage}>
                      <ImageSquare size={20} />
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 transition-all rounded-full py-2 px-4 h-fit text-white text-xs">
                      Tweet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          {!user && (
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
          )}
        </div>
      </div>
    </div>
  );
}
