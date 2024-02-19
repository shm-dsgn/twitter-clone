import { Tweet } from "@/gql/graphql";
import {
  ChatCircle,
  Export,
  Heart,
  Repeat,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props;

  return (
    <div className="border border-x-0 border-b-0 border-gray-900 p-4 hover:bg-gray-950 transition-all cursor-pointer">
      <div className="grid grid-cols-12">
        <div className="col-span-1">
          <Image
            src={
              data.author?.profileImageURL ||
              "https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png"
            }
            alt="profile"
            className="rounded-full"
            height={50}
            width={50}
          />
        </div>
        <div className="col-span-11 pl-4">
          <Link
            href={`/${data.author?.id}`}
            className=" text-sm font-semibold flex items-center gap-3"
          >
            <p className="hover:cursor-pointer hover:underline">
              {data.author?.firstName} {data.author?.lastName}{" "}
            </p>
            <p className="text-slate-800 text-xs">@{data.author?.id}</p>
          </Link>
          <p className="text-xs pt-2 whitespace-pre-wrap break-word break-all">
            {data.content}
          </p>
          {
            data.imageURL && (
              <div className="mt-4">
                <Image
                  src={data.imageURL}
                  alt="tweet-image"
                  width={900}
                  height={900}
                  className="rounded-lg object-cover"
                />
              </div>
            )
          }
          <div className="flex justify-between pr-12 mt-6 text-gray-500">
            <div>
              <ChatCircle size={20} />
            </div>
            <div>
              <Repeat size={20} />
            </div>
            <div>
              <Heart size={20} />
            </div>
            <div>
              <Export size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
