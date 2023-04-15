export async function getAllTasksData() {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`)
  );
  const tasks = await res.json();
  //djangoAPI作成時に設定した日時のデータcreated_atを使ってデータをソート
  const staticfilterdTasks = tasks.sort(
    //値が大きい(新しい)順にする
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  //getAllTasksDataは最終的にstaticfilterdTasksを返す
  return staticfilterdTasks;
}

//個別詳細ページのためのTaskId一覧を取得
export async function getAllTasksIds() {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`)
  );
  const tasks = await res.json();
  return tasks.map((task) => {
    return {
      params: {
        id: String(task.id),
      },
    };
  });
}

//idを受け取り個別タスクのデータを返す関数を定義
export async function getTaskData(id) {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}/`)
  );
  const task = await res.json();
  return {
    task,
  };
}
