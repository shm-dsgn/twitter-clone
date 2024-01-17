import {
  ChatCircle,
  Export,
  Heart,
  Repeat,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import React from "react";

const FeedCard: React.FC = () => {
  return (
    <div className="border border-x-0 border-b-0 border-gray-900 p-4 hover:bg-gray-950 transition-all cursor-pointer">
      <div className="grid grid-cols-12">
        <div className="col-span-1">
          <Image
            src="https://avatars.githubusercontent.com/u/77527904?v=4"
            alt="profile"
            className="rounded-full"
            height={50}
            width={50}
          />
        </div>
        <div className="col-span-11 pl-4">
          <h5 className=" text-sm font-semibold">Soham Dutta</h5>
          <p className=" text-xs pt-2">
            To safely allow optimizing images, define a list of supported URL
            patterns in next.config.js. Be as specific as possible to prevent
            malicious usage. For example, the following configuration will only
            allow images from a specific AWS S3 bucket:
          </p>
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
