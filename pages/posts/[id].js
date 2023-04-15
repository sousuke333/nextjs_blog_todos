import Layout from "../../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAllPostsIds, getPostData } from "../../lib/posts";

//ここで受け取るpostはgetStaticProps時のgetPostDataによって取得してきたpostデータ
export default function Post({ post }) {
  const router = useRouter();
  //getStaticPathsでfallbackを指定した場合にrouter.isFallback ||を追加してfallback中も判定を取るようにする
  if (router.isFallback || !post) {
    return <div>Loading...</div>;
  }
  return (
    <Layout title={post.title}>
      <p className="m-4">
        {"ID :"}
        {post.id}
      </p>
      <p className="mb-4 text-xl font-bold">{post.title}</p>
      <p className="mb-12">{post.created_at}</p>
      <p className="px-10">{post.content}</p>
      <Link href="/blog-page">
        <div className="flex cursor-pointer mt-12">
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          <span>Back to blog-page</span>
        </div>
      </Link>
    </Layout>
  );
}

//fallbackをtureにしておかないとブログデータを更新した際に新規idにアクセスしても404が返ってきてしまう
//trueにした場合build時に生成してないidもアクセスされた段階で生成される
//idに関しては自動生成してくれるがupdateに関しては変更してくれないのでIncrementalStaticRegenerationを使う必要がある
export async function getStaticPaths() {
  const paths = await getAllPostsIds();

  return {
    paths,
    fallback: true,
  };
}
//build時に実行し個別詳細のデータを取得しておく
export async function getStaticProps({ params }) {
  const { post: post } = await getPostData(params.id);
  // const post = await getPostData(params.id);
  return {
    props: {
      post,
    },
    //IncrementalStaticRegenerationの有効化,インターバル3秒の指定
    //データの更新自体は最初にアクセスされた時に実行されるので古いデータが表示される
    //その後3秒後にリロードすると更新完了されていれば新しいデータに書き変わっている
    //一度ISRが走ればその間(インターバル)はアクセスがあっても再生成は実行せず古いデータを表示、
    //更新データがあっても次のアクセスが一年後であればその間の初回ユーザーは古いデータを受け取る
    //ある程度のユーザーがアクセスする前提のシステム
    revalidate: 3,
  };
}