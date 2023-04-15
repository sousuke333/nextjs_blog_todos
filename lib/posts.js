export async function getAllPostsData() {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post/`)
  );
  const posts = await res.json();
  //djangoAPI作成時に設定した日時のデータcreated_atを使ってデータをソート
  const filteredPosts = posts.sort(
    //値が大きい(新しい)順にする
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  //getAllPostsDataは最終的にfilteredPostsを返す
  return filteredPosts;
}

//個別詳細ページのためのPostIdを取得
export async function getAllPostsIds() {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post/`)
  );
  const posts = await res.json();
  return posts.map((post) => {
    return {
      params: {
        id: String(post.id),
      },
    };
  });
}

//idを受け取りその記事のデータを返す関数を定義
export async function getPostData(id) {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-post/${id}/`)
  );
  const post = await res.json();
  return {
    post,
  };
}
