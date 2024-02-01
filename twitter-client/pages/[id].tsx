import { graphqlClient } from "@/clients/api";
import { Inter } from "next/font/google";
import FeedCard from "@/components/FeedCard/FeedCard";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { Tweet } from "@/gql/graphql";
import { getUserByIdQuery } from "@/graphql/query/user";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profileImageURL: string;
  tweets: Tweet[];
}

interface GetUserByIdResponse {
  getUserById: User;
}

interface ServerProps {
  userInfo?: User;
}

const inter = Inter({ subsets: ["latin"] });

const UserProfilePage: NextPage<ServerProps> = (props) => {
  return (
    <div className={inter.className}>
      <TwitterLayout>
        <div>
          <nav className="flex items-center gap-4 px-3 py-1">
            <ArrowLeft size={20} />
            <div>
              <h1 className=" font-semibold text-lg">
                {props.userInfo?.firstName} {props.userInfo?.lastName}
              </h1>
              <h1 className=" text-xs font-semibold text-slate-600">
                {props.userInfo?.tweets.length} Tweets
              </h1>
            </div>
          </nav>
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24">
                <Image
                  src={
                    props.userInfo
                      ? props.userInfo?.profileImageURL
                      : "https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png"
                  }
                  alt="user"
                  height={100}
                  width={100}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="flex items-center flex-col justify-center mt-4">
              <h1 className="text-lg font-semibold">
                {props.userInfo?.firstName} {props.userInfo?.lastName}
              </h1>
              <p className="text-slate-700 text-xs">@{props.userInfo?.id}</p>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex flex-col items-center">
                <h1 className="text-lg font-semibold">100</h1>
                <h1 className="text-xs text-slate-600">Following</h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-lg font-semibold">100</h1>
                <h1 className="text-xs text-slate-600">Followers</h1>
              </div>
            </div>
          </div>
          <div>
            {props.userInfo?.tweets?.map((tweet: Tweet) => (
              <FeedCard data={tweet as Tweet} key={tweet.id} />
            ))}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id;

  if (!id)
    return {
      notFound: true,
      props: {
        userInfo: undefined,
      },
    };

  const userInfo = await graphqlClient.request<GetUserByIdResponse>(
    getUserByIdQuery,
    { id: id }
  );

  if (!userInfo?.getUserById)
    return {
      notFound: true,
    };

  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};

export default UserProfilePage;
