import { Inter } from "next/font/google";
import Image from "next/image";
import { useCallback, useState } from "react";

import FeedCard from "@/components/FeedCard/FeedCard";
import TwitterLayout from "@/components/Layout/TwitterLayout";

import { ImageSquare } from "@phosphor-icons/react/dist/ssr";

import { Tweet } from "@/gql/graphql";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery, getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import axios from "axios";
import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  tweets?: Tweet[];
}

interface GetAllTweetsResponse {
  getAllTweets: Tweet[];
}

interface GetSignedURLForTweetResponse {
  getSignedURLForTweet: string;
}

export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();

  const { mutate } = useCreateTweet();
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async(event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if(!file) return;

      const {getSignedURLForTweet} = await graphqlClient.request<GetSignedURLForTweetResponse>(getSignedURLForTweetQuery, {
        imageName: file.name,
        imageType: file.type,
      })

      if(getSignedURLForTweet){
        toast.loading("Uploading image....", {id: '2'});
        await axios.put(getSignedURLForTweet, file, {
          headers: {
            "Content-Type": file.type,
          }
        })
        toast.success("Image uploaded successfully.", {id: '2'});
        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`;
        setImageURL(myFilePath);
      }
    }
  },[]);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    const handlerFn = handleInputChangeFile(input);
    input.addEventListener("change", handlerFn);
    input.click();
  }, [handleInputChangeFile]);

  const handleCreateTweet = useCallback(async () => {
    mutate({
      content,
      imageURL,
    });
  }, [content, mutate, imageURL]);

  return (
    <div className={inter.className}>
      <TwitterLayout>
        {user && (
          <div>
            <div className="border border-x-0 border-b-0 border-gray-900 p-4 ">
              <div className="grid grid-cols-12">
                <div className="col-span-1">
                  <Image
                    src={
                      user
                        ? user?.profileImageURL
                        : "https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png"
                    }
                    alt="profile"
                    className="rounded-full"
                    height={50}
                    width={50}
                  />
                </div>
                <div className="col-span-11 pl-4">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className=" w-full bg-transparent focus:outline-none border-b-2 border-slate-700"
                    rows={3}
                    placeholder="What's happening?"
                  ></textarea>
                  {
                    imageURL && <Image src={imageURL} alt="tweet-image" width={300} height={300}/>
                  }
                  <div className="text-blue-500 flex justify-between items-center">
                    <div
                      className="p-2 hover:bg-gray-900 cursor-pointer transition-all rounded-full h-fit w-fit"
                      onClick={handleSelectImage}
                    >
                      <ImageSquare size={20} />
                    </div>
                    <button
                      onClick={handleCreateTweet}
                      className="bg-blue-500 hover:bg-blue-600 transition-all rounded-full py-2 px-4 h-fit text-white text-xs"
                    >
                      Tweet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {Array.isArray(props.tweets) &&
          props.tweets.map((tweet: Tweet) =>
            tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
          )}
      </TwitterLayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const allTweets = await graphqlClient.request<GetAllTweetsResponse>(
    getAllTweetsQuery
  );
  return {
    props: {
      tweets: allTweets?.getAllTweets as Tweet[],
    },
  };
};
