import { useContext } from "react";
import { StateContext } from "../context/StateContext";
import Cookie from "universal-cookie";

const cookie = new Cookie();
//task-page(呼び出し元)から渡されたpropsを渡すtaskCreated={mutate}
export default function TaskForm({ taskCreated }) {
  //global用のstateを呼び出し
  const { selectedTask, setSelectedTask } = useContext(StateContext);


  //task新規作成のイベント、submitに紐づける
  const create = async (e) => {
    //submitのdefault挙動をキャンセル
    e.preventDefault();
    //post req をJWTtoken付きで投げる
    await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/tasks/`, {
      method: "POST",
      //selectedTaskに入れたユーザーの編集を設定
      body: JSON.stringify({ title: selectedTask.title }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${cookie.get("access_token")}`,
      },
    }).then((res) => {
      if (res.status === 401) {
        alert("JWT Token not valid");
      }
    });
    //reqした後にsetSelectedTaskを初期化
    setSelectedTask({ id: 0, title: "" });
    //mutateを実行してキャッシュ初期化
    taskCreated();
  };

  //更新用関数
  const update = async (e) => {
    e.preventDefault();
    await fetch(
      //元ある物の編集なのでidのエンドポイントに注意
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/tasks/${selectedTask.id}/`,
      {
        //更新なのでPUT
        method: "PUT",
        body: JSON.stringify({ title: selectedTask.title }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${cookie.get("access_token")}`,
        },
      }
    ).then((res) => {
      if (res.status === 401) {
        alert("JWT Token not valid");
      }
    });
    //createと同じく初期化処理
    setSelectedTask({ id: 0, title: "" });
    taskCreated();
  };

  return (
    <div>
      {/* selectedTask.idが0なら新規作成1以上なら更新 */}
      <form onSubmit={selectedTask.id !== 0 ? update : create}>
        <input
          className="text-black mb-8 px-2 py-1"
          type="text"
          value={selectedTask.title}
          onChange={(e) =>
            //imputに入力があった際selectedTaskのtitleのみ入力値で更新
            setSelectedTask({ ...selectedTask, title: e.target.value })
          }
        />
        <button
          type="submit"
          className="bg-gray-500 ml-2 hover:bg-gray-600 text-sm px-2 py-1 rounded uppercase"
        >
          {/* selectedTask.idが0かどうかで表記変更 */}
          {selectedTask.id !== 0 ? "update" : "create"}
        </button>
      </form>
    </div>
  );
}
