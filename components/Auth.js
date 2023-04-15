import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useRouter } from "next/router";
import Cookie from "universal-cookie";

const cookie = new Cookie();

export default function Auth() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  //login用の関数
  const login = async () => {
    try {
      //render.comで作ったapi/auth/jwt/create/にPOST req してJWTトークンの生成
      await fetch(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
        {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          //resに失敗の400が来た時エラー文を返す
          if (res.status === 400) {
            throw "authentication failed";
          } else if (res.ok) {
            //正常ならjsonに変換して返却
            return res.json();
          }
        })
        .then((data) => {
          //取得できたアクセストークンをcookieにset
          //optionsにrootを指定　下記のcookie情報をどこで使えるかの指定、root配下のパスなら使えるように指定
          const options = { path: "/" };
          //"access_token"の部分は任意の名前でよい
          cookie.set("access_token", data.access, options);
        }); //アクセストークンが無事発行されれば/main-pageへ遷移
      router.push("/main-page");
    } catch (err) {
      alert(err);
    }
  };

  //submitが押された時に実行させる関数
  const authUser = async (e) => {
    //submitの画面遷移防止
    e.preventDefault();
    //isLoginのstateがtrueならlogin()実行falseならregisterの処理
    if (isLogin) {
      login();
    } else {
      try {
        //ユーザー登録画面へusernameとpasswordをPOST reqする
        await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`, {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          //エラー時の処理
          if (res.status === 400) {
            throw "authentication failed";
          }
        });
        //上記の新規ユーザー登録が通ればlogin()を実行する
        login();
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <>
      <div className="w-full max-w-md space-y-8">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            {isLogin ? "Login" : "Sign up"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={authUser}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-white hover:text-indigo-500 cursor-pointer"
              >
                Change mode?
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              {isLogin ? "Login with JWT" : "Create new user"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
