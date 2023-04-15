import Layout from "../components/Layout";
import Post from "../components/Post";
import Link from "next/link";
import { getAllPostsData } from "../lib/posts";

export default function BlogPage({ filteredPosts }) {
  return (
    <Layout title="Blog Page">
      <ul>
        {/* filteredPostsが存在する場合map処理　処理内容は<Post key={post.id} post={post} />の形式に直して返却 */}
        {filteredPosts &&
          filteredPosts.map((post) => <Post key={post.id} post={post} />)}
      </ul>
      <Link href="/main-page">
        <div className="flex cursor-pointer mt-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
          </svg>
          <span>Back to main page</span>
        </div>
      </Link>
    </Layout>
  );
}

//サーバーサイドでbuild時に実行してほしい処理はgetStaticProps内で
export async function getStaticProps() {
  //apiからpostdataを取得
  const filteredPosts = await getAllPostsData();
  return {
    props: { filteredPosts },
    //データ追加&ユーザーアクセスで更新を走らせる
    revalidate: 3,
  };
}
