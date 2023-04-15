import { useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { getAllTasksData } from "../lib/tasks";
import Task from "../components/Task";
import useSWR from "swr";
import StateContextProvider from "../context/StateContext";
import TaskForm from "../components/TaskForm";



//useSWRを使う準備
//urlを引数にリクエストを投げてjson形式で返してくれる関数
const fetcher = (url) => fetch(url).then((res) => res.json());
//djangoAPIのtaskのエンドポイント
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`;
//-------------------------------------------------------------------
//useSWRに渡す物1:リクエストするエンドポイント,2:fetcher関数,3:fallbackDataに対して記事のデータ
//useSWRから取得できるもの1:取得してきたデータ2:実行するとdataのキャッシュを更新する関数(useStateにfetchが付いた感じ)
export default function TaskPage({ staticfilterdTasks }) {
  //useSWRはクライアント再度で走るfetching
  const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
    fallbackData: staticfilterdTasks,
  });
  //taskを更新が新しい物順に並び替え
  const filteredTasks = tasks?.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  //キャッシュが更新されるようにuseEffectを仕込む
  //マウントされた際に一回だけ実行されるように初期値を空配列
  useEffect(() => {
    mutate();
  }, []);
  return (
    //</StateContextProvider>でwrapすると定義していたstateを扱える
    <StateContextProvider>
    <Layout title="Task Page">
    {/* propsとしてキャッシュ初期化用にmutateを渡す */}
    <TaskForm taskCreated={mutate} />
      <ul>
        {filteredTasks &&
          filteredTasks.map((task) => (
            //map処理でtaskの分ループ表示
            //taskのdelete後にtasksのキャッシュを更新したいのでpropsとしてmutateを渡す
            <Task key={task.id} task={task} taskDeleted={mutate} />
          ))}
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
    </StateContextProvider>
  );
}

export async function getStaticProps() {
  const staticfilterdTasks = await getAllTasksData();
  return {
    props: { staticfilterdTasks },
    //ISRを有効かするため指定//アクセスでstaticpageが自動生成される。生成後はちらつきもなく即座に表示できる
    revalidate: 3,
  };
}
