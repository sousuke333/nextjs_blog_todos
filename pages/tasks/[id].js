import { useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getAllTasksIds, getTaskData } from "../../lib/tasks";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Post({ staticTask, id }) {
  const router = useRouter();
  const { data: task, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}`,
    fetcher,
    {
      fallbackData: staticTask,
    }
  );
  useEffect(() => {
    mutate();
  }, []);
  //revalidateしても指定idのrouteが存在しない時、taskが存在しないとき
  if (router.isFallback || !task) {
    return <div>Loading...</div>;
  }
  return (
    <Layout title={task.title}>
      <span className="mb-4">
        {"ID : "}
        {task.id}
      </span>
      <p className="mb-4 text-xl font-bold">{task.title}</p>
      <p className="mb-12">{task.created_at}</p>
      <Link href="/task-page">
        <div className="flex cursor-pointer mt-8">
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
          <span>Back to task-page</span>
        </div>
      </Link>
    </Layout>
  );
}
//taskid一覧を取得,server起動中id追加される事にfallback指定で対応
export async function getStaticPaths() {
  const paths = await getAllTasksIds();
  return {
    paths,
    fallback: true,
  };
}
//build時に一回起動
export async function getStaticProps({ params }) {
  //idに応じたtaskを受け取りstaticTaskと定義
  const { task: staticTask } = await getTaskData(params.id);
  // const staticTask = await getTaskData(params.id);
  return {
    //idとtaskデータをpropsとして渡す
    //revalidateでデータ元に更新があればアクセス時staticPageを生成
    props: {
      id: staticTask.id,
      staticTask,
    },
    revalidate: 3,
  };
}