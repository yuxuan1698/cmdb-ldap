export default {
    'header.user.menu.center':"パーソナルセンター",
    'header.user.menu.changepass':"パスワード変更",
    'header.user.menu.setting':"システム設定",
    'header.user.menu.exit':"ログインを終了",
    //ログインセクション
    'login.title':'ウービーダIT情報管理プラットフォーム - （CMDB）',
    'login.loginbtn':'登陆',
    'login.username':'ユーザー名',
    'login.password':'パスワード',
    'login.forget':"パスワードを忘れました",
    'login.remember':"パスワードを記憶する",
    'login.usernamemsg':'ユーザー名を入力してください！',
    'login.passwordmsg':'ユーザーパスワードを入力してください！',
    'login.loginout.msg':'{ニックネーム}  - 本当にシステムを終了しますか？' ,
    'login.loginout.title':'ログインプロンプトを終了します',
    //パスワード部分を変更する
    'user.changepassword.username':'現在のユーザー',
    'user.changepassword.oldpassword':'元のパスワードを入力してください',
    'user.changepassword.newpassword':'新しいパスワードを入力してください',
    'user.changepassword.newpasslen':'新しいパスワードセキュリティポリシーには最低6文字が必要です。' ,
    'user.changepassword.repassword':'新しいパスワードの確認',
    'user.changepassword.reset':'変更のリセット',
    'user.changepassword.submit':'変更を保存',
    'user.changepassword.passdiff':'2つのパスワードエントリが矛盾しています。' ,
    'user.changepassword.success.title':'パスワード変更プロンプト',
    'user.changepassword.success.msg':'{status}は再ログインが必要です。' ,
    'user.changepassword.signerror':'URLパラメータの署名が無効です。悪意のあるデータを送信しないでください。' ,
    //リクエストパーツ
    'request.status':'ステータスコード',
    'request.status.200 ':'サーバーは要求されたデータを正常に返しました。',
    'request.status.201':'データの作成または修正に成功しました。',
    'request.status.202':'要求がバックグラウンドキューに入りました（非同期タスク）',
    'request.status.204':'データの削除に成功しました。',
    'request.status.400 ':'要求がエラーで送信されたか,サーバーが例外を処理しました。',
    'request.status.401 ':'あなたのログインセッションが期限切れになったか,トークンが間違っていて再ログインする必要があります。 ',
    'request.status.403':'ユーザーは認証されていますが,アクセスが禁止されています。',
    'request.status.404 ':'リクエストページまたはインターフェースが存在しません,サーバーが動作していません。',
    'request.status.406':'リクエストのフォーマットが利用できません。',
    'request.status.410 ':'要求されたリソースは完全に削除されたため,再度受信されることはありません。',
    'request.status.422':'オブジェクトを作成するときに検証エラーが発生しました。',
    'request.status.500 ':'サーバーでエラーが発生しました。サーバーを確認してください。 ',
    'request.status.502':'ゲートウェイエラー',
    'request.status.503 ':'サービスは利用できません,サーバは一時的に過負荷または維持されています。',
    'request.status.504':'ゲートウェイがタイムアウトしたか,サーバーにアクセスできません。',
    'request.status.other':'ステータスが不明です',
    'request.status.timeout':'接続タイムアウト,または不明なエラーです。' ,
    //システムグループのプロンプト
    'cmdb.error':'間違った要求,またはサーバがエラーを返しました。',
  
    //メニューの横を操作します
    'menu.side.myhome':'私の家',
    'menu.side.users':'ユーザー管理',
    'menu.side.users.list':'ユーザーリスト',
    'menu.side.users.perm':'ユーザー権利',
    'menu.side.users.ldap':'LDAP管理',
    'menu.side.resource':'リソース管理',
    'menu.side.resource.device':'デバイスリスト',
    'menu.side.resource.monitor':'デバイス監視',
    'menu.side.system':'システム管理',
    'menu.side.system.setting':'システム設定',
    'menu.side.system.logs':'システムログ',
    'menu.side.system.email':'メール通知',
  
    //ブレッドクラム
    'breadcrumb_homepage':'ホーム',
    'breadcrumb_users_manager':'ユーザ管理',
    'breadcrumb_users_list':'ユーザリスト',
    'breadcrumb_user_permission':'ユーザ権利管理',
    'breadcrumb_ldap_manager':'LDAP管理',
    'breadcrumb_system_setting':'システム設定',
    'breadcrumb_system_basesetting':'基本設定',
    'breadcrumb_system_logs':'システムログ',
    //ユーザーリスト
    'userlist_table_account':'ユーザー名',
    'userlist_table_username':'ユーザー名',
    'userlist_table_cn':'エイリアス',
    'userlist_table_mobile':'携帯電話番号',
    'userlist_table_department':'ジョブ名',
    'userlist_table_ou':'所属部署',
    'userlist_table_email':'メールボックス',
    'userlist_table_action':'アクション',
    'userlist_table_status':'州',
    'userlist_table_operation':'操作',
    'userlist_table_status_value':'普通',
    'userlist_table_status_value_lock':'ロック時間:{locktime}',
    'userlist_table_select_user':'現在選択されている[{usercount}]人のユーザー',
    'userlist_table_search':'クエリの内容を入力してください',
    'userlist_table_adduser':'ユーザーの追加',
    'userlist_table_resetpassword':'ユーザー{ユーザー名}パスワードのリセット',
    'userlist_useredit_del':'ユーザーの削除',
    'userlist_useredit_del_content':'ユーザー[{delkey}]を削除しますか？削除後に復元することはできません！',
    'userlist_useredit_delall_content':'これらのユーザーを削除してもよろしいですか？削除した後に回復することはできません！',
    'userlist_useredit_edit':'ユーザの編集',
    'userlist_useredit_lock':'ユーザーをロック',
    'userlist_useredit_lock_content':'ユーザー[{delkey}]をロックしてよろしいですか？',
    'userlist_useredit_unlock':'ユーザのロック解除',
    'userlist_useredit_unlock_content':'ユーザー[$ {delkey}]のロックを解除してもよろしいですか？',
    'userlist_useredit_batchdel':'一括削除',
    'userlist_useredit_batchlock':'一括ロック',
    'userlist_useredit_batchunlock':'一括ロック解除',
    'userlist_useredit_exportuser':'ユーザーリストのエクスポート',
    'userlist_useredit_batch':'バッチ操作',
    'userlist_userreset_password':'ユーザー[{username}]パスワードのリセット',
    'userlist_userreset_password_msg':'ユーザーのパスワードをリセットします[{username}]。リセット後,新しいパスワードが電子メールでユーザーに送信されます。確認してください。',
    'userlist_userreset_success':'ユーザーパスワードを正常にリセットする',
  
    //ユーザーを追加
    'userlist_useradd_new':'新しいユーザーを追加します',
    'userlist_useradd_template':'テンプレートモード',
    'userlist_useradd_pro':'プロモード',
    'userlist_useradd_field_parent':'フィールド属性',
    'userlist_useradd_field_choise':'属性属性クラスを選択してください',
    'userlist_useradd_choise_commander':'属性リーダー/上長を選択してください（{i}）',
    'userlist_useradd_input_tips':'{fieldname}（{fieldval}）を入力してください',
    'userlist_useradd_del_field':'フィールドを削除',
    'userlist_useradd_cancel':'キャンセル',
    'userlist_useradd_save':'保存',
    'userlist_useradd_tips':'成功のプロンプトを追加します',
    'userlist_useradd_tips_content':'ユーザーは正常に追加されました。',
    'userlist_useradd_delfield_tips':'フィールドの削除に失敗しました',
    'userlist_useradd_delfield_failed':'このフィールドは必須フィールドです。削除することはできません。',
    'userlist_useradd_success_tips':'成功のプロンプトを追加します',
    'userlist_useradd_success_content':'ユーザーは正常に追加されました。',
    'userlist_useradd_addfield_button':'フィールド情報の追加',
    'userlist_useradd_notfount_field':'フィールドが見つかりません',
    //ユーザー変更
    'userlist_userupdate_new':'ユーザー属性の更新',
    'userlist_usermodify_tips':'成功プロンプトの修正',
    'userlist_usermodify_content':'ユーザーの修正は成功しました。',
    //ユーザー情報
    'userlist_user_info':'ユーザー属性',
    'userlist_user_base_attr':'基本属性',
    'userlist_user_extra_attr':'拡張属性',
    'userlist_user_other_attr':'その他の属性',
    
    // ldap_field_map_name
    ldap_uid:'ユーザー名',
    ldap_sn:'ユーザー名',
    ldap_givenName:'ユーザーの別名',
    ldap_mobile:'携帯電話番号',
    ldap_cn:'ユーザエイリアス',
    ldap_mail:'メールボックスのEメール',
    ldap_uidNumber:'ユーザUID',
    ldap_gidNumber:'ユーザグループID',
    ldap_loginShell:'SHELLにログイン',
    ldap_departmentNumber:'ジョブ名',
    ldap_homeDirectory:'ユーザーディレクトリ',
    ldap_userPassword:'ユーザーパスワード',
    ldap_manager:'リーダー/スーペリア',
    ldap_description:'備考/説明',
    ldap_ou:'所属部署',
    ldap_o:'組織ユニット',
    ldap_member:'メンバー',
    ldap_uniqueMember:'唯一のメンバー',
    ldap_memberUid:'Unixグループメンバー',
    ldap_objectClass:'ユーザ属性',
    ldap_createTimestamp:'作成時間',
    ldap_modifyTimestamp:'時刻を修正する',
    ldap_pwdChangedTime:'パスワード変更時刻',
    ldap_hasSubordinates:'部下の有無にかかわらず',
    ldap_creatorsName:'作成者',
    ldap_modifiersName:'人々の修正',
    ldap_memberOf:'ユーザ権限',
    ldap_sshPublicKey:'ユーザ公開鍵',
    ldap_pwdFailureTime:'パスワード認証失敗時間',
    ldap_pwdAccountLockedTime:'ユーザーロック時間',
    ldap_structuralObjectClass:'構造オブジェクトクラス',
    ldap_entryUUID:'ユーザーUUID',
    ldap_entryDN:'ユーザーDN',
  
    // LDAPマネージャ
    'ldapmanager_add_dn':'新しいノード',
    'ldapmanager_del_dn':'ノードの削除',
    'ldapmanager_flush_dn':'ノードの更新',
    'ldapmanager_rename_dn':'ノード名の変更',
    'ldapmanager_del_tips':'プロンプトを削除する',
    'ldapmanager_del_tips_content':'このDNを削除してもよろしいですか:{selectedKeys},削除後に復元されませんか？',
    'ldapmanager_add_not_opration':'新しいDNで,操作を選択できません。',
    'ldapmanager_add':'追加',
    'ldapmanager_del':'削除',
    'ldapmanager_flush':'更新する',
    'ldapmanager_create_entry_success':'エントリは正常に作成されました。',
    'ldapmanager_save_success':'データは正常に保存されました。',
    'ldapmanager_tips':'暖かいヒント',
    'ldapmanager_content_li1':'新しいDNを作成するときは,objectClassを選択する必要があります。すべてのフィールドはobjectClassです。',
    'ldapmanager_content_li2':'新しいDNを作成するとき,フィールドはdnフィールドとしてuid,cn,oの順にあり,優先順位は前面から背面へです。',
    'ldapmanager_content_li3':'パスワードフィールドはデフォルトではパスワードを表示しません。パスワードを変更しない場合は空白のままにしてください。ただしフィールドは削除しないでください。',
    'ldapmanager_loading':'読み込み中...',
    'ldapmanager_newadd':'新規',
    'ldapmanager_save':'保存する',
  
    // LDAP権限
    'ldap_permission_add_group':'このグループにユーザーを追加する',
    'ldap_permission_save_field':'権限の保存に失敗しました',
    'ldap_permission_save_field_msg':'パーミッショングループ[<strong style = {{color:"red"}}> {groupname} </strong>]割り当てられたユーザーは空で,少なくとも1人のユーザーがパーミッショングループに属している必要があります。',
    'ldap_permission_save_success':'成功のプロンプトを保存します',
    'ldap_permission_remove_choise':'選択した権限アイテムを削除する',
    'ldap_permission_remove_content':'現在のユーザーの権限[{currUser}]',
    'ldap_permission_table_id1':'親グループに所属しています',
    'ldap_permission_table_id2':'権限グループ名',
    'ldap_permission_table_id3':'グループの説明',
    'ldap_permission_backup':'return',
    'ldap_permission_save':'パーミッションの保存',
    'ldap_permission_choise':'最初にユーザーを選択してください...',
  }
  
  