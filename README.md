MyThreadBookmark-for-Facebook
=============================

Facebookのグループのスレッドをブックマークしていつでもアクセス出来るようにしたものです。
ブックマークはローカルストレージに保管してますので、異なるブラウザや端末ではデータの共有が出来ません。

## Facebookアプリ登録
1. Facebook Developerでアプリの作成
2. permissionは user_groups のみ
3. ローカルで試したい人はhttp://localhost:8100等をSettings→WebSite→SiteURLにて登録する

## app/scripts/app.jsの修正

```javascript
FacebookProvider.init('YOUR_APP_ID');
```

## 起動
```bash
$ grunt serve
```

## 使い方
1. LoginタブからFacebookログインして下さい。
2. GroupタブからFacebookグループを選択して下さい。スレッド一覧が表示されます
3. スレッドをタップすると、ブックマークするか聞かれるので、気になるスレッドを登録して下さい。
4. ホームにスレッドが登録されているので、タップすると対象のスレッドのFacebookページが表示されると
思います。

## 注意点
1. ブックマークを削除する機能がありません。(1日で作ったアプリですし)ChromeDevTool等で直接ローカルストレージを消して下さい
"ls.bookmark"で登録されています。
