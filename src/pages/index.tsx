import Head from "next/head";
// import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

import { api, type RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import Image from "next/image";
import { LoadingPage } from "~/components/loading";

const CreatePostWizard = () => {
  const { user } = useUser();
  // console.log(user);

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        className="h-12 w-12 rounded-full"
        src={user.profileImageUrl}
        alt="Profile user image"
        width={56}
        height={56}
      />
      <input
        placeholder="Type an emoji...!"
        className="grow bg-transparent outline-none"
      ></input>
    </div>
  );
};

type PostViewWithUser = RouterOutputs["post"]["getAll"][number];
const PostView = (props: PostViewWithUser) => {
  const { post, user } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={user.profileImageURL}
        className="h-12 w-12 rounded-full"
        alt="Profile user image"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{`@${user.name} `}</span>
          <span className="font-thin">{`  ·  ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();
  
  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {[...data].map((fullProps) => (
        <PostView key={fullProps.post.id} {...fullProps} />
      ))}
    </div>
  );
};

export default function Home() {
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const { user, isLoaded: userLoaded } = useUser();
  api.post.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"> */}
        {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 "> */}
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          {/* <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1> */}
          <div className="flex justify-between border-b border-slate-400 p-4">
            <CreatePostWizard />
            <UserButton afterSignOutUrl="/" />
          </div>
          {/* <div className="flex flex-col">
            {[...data].map((fullProps) => (
              <PostView key={fullProps.post.id} {...fullProps} />
            ))}
          </div> */}
          <Feed />
          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div> */}
          {/* <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p> */}
        </div>
      </main>
    </>
  );
}
