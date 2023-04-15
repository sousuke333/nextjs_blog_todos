import { createContext, useState } from "react";

export const StateContext = createContext();

export default function StateContextProvider(props) {
  //globalで使いたいstateの定義
  const [selectedTask, setSelectedTask] = useState({ id: 0, title: "" });
  //Providerで共有したい値を指定
  //props.childrenとすることでこのProviderでwrapした物が入ってくる
  return (
    <StateContext.Provider
      value={{
        selectedTask,
        setSelectedTask,
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
}