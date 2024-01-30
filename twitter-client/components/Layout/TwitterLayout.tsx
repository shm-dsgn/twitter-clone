import Image from "next/image";
import React, { useCallback } from "react";
import {
  Bell,
  BookmarkSimple,
  DotsThree,
  EnvelopeSimple,
  Hash,
  House,
  TwitterLogo,
  User,
  Feather
} from "@phosphor-icons/react/dist/ssr";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";

interface TwitterLayoutProps {
  children: React.ReactNode;
}

interface TwitterSideBarButton {
  icon: React.ReactNode;
  title: string;
}

interface VerifyGoogleTokenResult {
  verifyGoogleToken: string;
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

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();

  const queryClient = useQueryClient();
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
    <div>
      <div className="grid grid-cols-12 h-screen w-screen sm:px-48">
        <div className="col-span-2 sm:col-span-3 flex justify-end pt-8 sm:pr-4 relative">
          <div>
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
                  <p className="hidden sm:inline text-lg">{item.title}</p>
                </div>
              ))}
            </div>
            <button className="hidden sm:block bg-blue-500 hover:bg-blue-600 transition-all rounded-full p-3 h-fit w-full text-white font-semibold mt-4">
              Tweet
            </button>
            <button className="block sm:hidden bg-blue-500 hover:bg-blue-600 transition-all rounded-full p-3 h-fit text-white font-semibold mt-4">
            <Feather size={20} />
            </button>
          </div>

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
              <p className="hidden sm:block text-sm">
                {user.firstName} {user.lastName}
              </p>
            </div>
          )}
        </div>
        <div className="col-span-10 sm:col-span-6 border-x-[0.5px] border-gray-800 h-screen overflow-y-scroll no-scrollbar">
          {props.children}
        </div>
        <div className="col-span-0 sm:col-span-3">
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
};

export default TwitterLayout;
