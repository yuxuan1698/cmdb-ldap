export default {
  'header.user.menu.center': "个人中心",
  'header.user.menu.changepass': "修改密码",
  'header.user.menu.setting': "系统设置",
  'header.user.menu.exit': "退出登陆",
  // 登陆部分
  'login.title':'物必达IT信息管理平台-(CMDB)',
  'login.loginbtn': '登 陆',
  'login.username': '用户名',
  'login.password': '密码',
  'login.forget': "忘记密码",
  'login.remember': "记住密码",
  'login.usernamemsg': '请输入用户名!',
  'login.passwordmsg': '请输入用户密码!',
  'login.loginout.msg':'{nickname}-您确定要退出系统吗？',
  'login.loginout.title':'退出登陆提示',
  // 修改密码部分
  'user.changepassword.username': '当前用户',
  'user.changepassword.oldpassword': '输入原密码',
  'user.changepassword.newpassword': '输入新密码',
  'user.changepassword.newpasslen': '新密码安全策略要求最少6个字符！',
  'user.changepassword.repassword': '确认新密码',
  'user.changepassword.reset': '重置修改',
  'user.changepassword.submit': '保存修改',
  'user.changepassword.passdiff': '两次密码输入不一致！',
  'user.changepassword.success.title': '密码修改提示',
  'user.changepassword.success.msg': '{status} 需要重新登陆！',
  'user.changepassword.signerror':'URL参数签名不合法，请不要提交恶意数据。',
  // 请求部分
  'request.status': '状态码:',
  'request.status.200': '服务器成功返回请求的数据.',
  'request.status.201': '新建或修改数据成功.',
  'request.status.202': '一个请求已经进入后台排队（异步任务）.',
  'request.status.204': '删除数据成功.',
  'request.status.400': '发出的请求有错误，或服务器处理异常.',
  'request.status.401': '你的登陆会话已失效或令牌错误,需要重新登陆.',
  'request.status.403': '用户得到授权，但是访问是被禁止的.',
  'request.status.404': '请求页面或接口不存在，服务器没有进行操作.',
  'request.status.406': '请求的格式不可得.',
  'request.status.410': '请求的资源被永久删除，且不会再得到的.',
  'request.status.422': '当创建一个对象时，发生一个验证错误.',
  'request.status.500': '服务器发生错误，请检查服务器.',
  'request.status.502': '网关错误.',
  'request.status.503': '服务不可用，服务器暂时过载或维护.',
  'request.status.504': '网关超时,或服务器不可达.',
  'request.status.other': '未知状态.',
  'request.status.timeout': '连接超时，或未知错误！',
  // 系统组提示语
  'cmdb.error':'错误的请求,或服务器返回错误.',

  // 控制菜单side部分
  'menu.side.myhome':'我的首页',
  'menu.side.users':'用户管理',
  'menu.side.users.list':'用户列表',
  'menu.side.users.perm':'用户权限',
  'menu.side.users.ldap':'LDAP管理',
  'menu.side.resource':'资源管理',
  'menu.side.resource.device':'设备列表',
  'menu.side.resource.monitor':'设备监控',
  'menu.side.system':'系统管理',
  'menu.side.system.setting':'系统设置',
  'menu.side.system.logs':'系统日志',
  'menu.side.system.email':'邮件通知',

  // breadcrumb
  'breadcrumb_homepage':'主页',
  'breadcrumb_users_manager':'用户管理',
  'breadcrumb_users_list':'用户列表',
  'breadcrumb_user_permission':'用户权限管理',
  'breadcrumb_ldap_manager':'LDAP管理',
  'breadcrumb_system_setting':'系统设置',
  'breadcrumb_system_basesetting':'基本设置',
  'breadcrumb_system_logs':'系统日志',
  // user list
  'userlist_table_account':'用户名',
  'userlist_table_username':'用户姓名',
  'userlist_table_cn':'别名',
  'userlist_table_mobile':'手机号码',
  'userlist_table_department':'职位名称',
  'userlist_table_ou':'所属部门',
  'userlist_table_email':'邮箱',
  'userlist_table_action':'动作',
  'userlist_table_status':'状态',
  'userlist_table_operation':'操作',
  'userlist_table_status_value':'正常',
  'userlist_table_status_value_lock':'锁定时间:{locktime}',
  'userlist_table_select_user':'当前选中[ {usercount} ]个用户',
  'userlist_table_search':'请输入查询内容',
  'userlist_table_adduser':'添加用户',
  'userlist_table_resetpassword':'重置用户{username}密码',
  'userlist_useredit_del':'删除用户',
  'userlist_useredit_del_content':'你确定要删除用户[{delkey}]吗？删除后无法恢复！',
  'userlist_useredit_delall_content':'你确定要删除这些用户吗？删除后无法恢复哦！',
  'userlist_useredit_edit':'编辑用户',
  'userlist_useredit_lock':'锁定用户',
  'userlist_useredit_lock_content':'你确定要锁定用户[{delkey}]吗？',
  'userlist_useredit_unlock':'解锁用户',
  'userlist_useredit_unlock_content':'你确定要解锁用户[${delkey}]吗？',
  'userlist_useredit_batchdel':'批量删除',
  'userlist_useredit_batchlock':'批量锁定',
  'userlist_useredit_batchunlock':'批量解锁',
  'userlist_useredit_exportuser':'导出用户列表',
  'userlist_useredit_batch':'批量操作',
  'userlist_userreset_password':'重置用户[{username}]密码',
  'userlist_userreset_password_msg':'你确定要重置用户[{username}]的密码，重置后新密码通过邮件发送到用户，请注意查收！',
  'userlist_userreset_success':'重置用户密码成功',

  // add user
  'userlist_useradd_new':'添加新用户',
  'userlist_useradd_template':'模板模式',
  'userlist_useradd_pro':'专业模式',
  'userlist_useradd_field_parent':'字段归属',
  'userlist_useradd_field_choise':'请选择属性归属类',
  'userlist_useradd_choise_commander':'请选择属性领导/上级({i})',
  'userlist_useradd_input_tips':'请输入{fieldname}({fieldval})',
  'userlist_useradd_del_field':'删除字段',
  'userlist_useradd_cancel':'取消',
  'userlist_useradd_save':'保存',
  'userlist_useradd_tips':'添加成功提示',
  'userlist_useradd_tips_content':'用户添加成功！',
  'userlist_useradd_delfield_tips':'字段删除失败',
  'userlist_useradd_delfield_failed':'此字段为必须字段，无法删除！',
  'userlist_useradd_success_tips':'添加成功提示',
  'userlist_useradd_success_content':'用户添加成功！',
  'userlist_useradd_addfield_button':'添加字段信息',
  'userlist_useradd_notfount_field':'没有找到字段',
  // user modify
  'userlist_userupdate_new':'更新用户属性',
  'userlist_usermodify_tips':'修改成功提示',
  'userlist_usermodify_content':'用户修改成功！',
  // user info
  'userlist_user_info':'用户属性',
  'userlist_user_base_attr':'基本属性',
  'userlist_user_extra_attr':'扩展属性',
  'userlist_user_other_attr':'其它属性',
  
  // ldap_field_map_name
  ldap_uid:'用户名',
  ldap_sn:'用户姓名',
  ldap_givenName:'用户附名',
  ldap_mobile:'手机号码',
  ldap_cn:'用户别名',
  ldap_mail:'邮箱EMail',
  ldap_uidNumber:'用户UID',
  ldap_gidNumber:'用户组ID',
  ldap_loginShell:'登陆SHELL',
  ldap_departmentNumber:'职位名称',
  ldap_homeDirectory:'用户目录',
  ldap_userPassword:'用户密码',
  ldap_manager:'领导/上级',
  ldap_description:'备注/描述',
  ldap_ou:'所属部门',
  ldap_o:'组织单位',
  ldap_member:'成员',
  ldap_uniqueMember:'唯一成员',
  ldap_memberUid:'Unix组成员',
  ldap_objectClass:'用户属性',
  ldap_createTimestamp:'创建时间',
  ldap_modifyTimestamp:'修改时间',
  ldap_pwdChangedTime:'密码修改时间',
  ldap_hasSubordinates:'有无下属',
  ldap_creatorsName:'创建人',
  ldap_modifiersName:'修改人',
  ldap_memberOf:'用户权限',
  ldap_sshPublicKey:'用户公钥',
  ldap_pwdFailureTime:'密码认证失败时间',
  ldap_pwdAccountLockedTime:'用户锁定时间',
  ldap_structuralObjectClass:'结构对象类',
  ldap_entryUUID:'用户UUID',
  ldap_entryDN:'用户DN',

  // ldap manager
  'ldapmanager_add_dn':'新建节点',
  'ldapmanager_del_dn':'删除节点',
  'ldapmanager_flush_dn':'刷新节点',
  'ldapmanager_rename_dn':'重命名节点',
  'ldapmanager_del_tips':'删除提示',
  'ldapmanager_del_tips_content':'你确定要删除这个DN:{selectedKeys},删除后将无法恢复？',
  'ldapmanager_add_not_opration':'新建DN中,无法选择操作.',
  'ldapmanager_add':'添加',
  'ldapmanager_del':'删除',
  'ldapmanager_flush':'刷新',
  'ldapmanager_create_entry_success':'Entry创建成功！',
  'ldapmanager_save_success':'数据保存成功！',
  'ldapmanager_tips':'温馨提示',
  'ldapmanager_content_li1':'在新建DN时，必须选择objectClass,所有字段规属objectClass。',
  'ldapmanager_content_li2':'在新建DN时，字段以uid,cn,o为顺序，做为dn 字段，优先级以从前到后。',
  'ldapmanager_content_li3':'密码字段默认不显示密码，如果不修改密码就留空但不要删除字段。',
  'ldapmanager_loading':'加载中......',
  'ldapmanager_newadd':'新建',
  'ldapmanager_save':'保存',

  // ldap permission
  'ldap_permission_add_group':'添加用户到此组',
  'ldap_permission_save_field':'保存权限失败',
  'ldap_permission_save_field_msg':'权限组[<strong style={{color:"red"}}>{groupname}</strong>]所分配的用户为空，最少需要有一人在权限组内。',
  'ldap_permission_save_success':'保存成功提示',
  'ldap_permission_remove_choise':'移除所选权限项',
  'ldap_permission_remove_content':'当前用户[{currUser}]的权限。',
  'ldap_permission_table_id1':'所属父级组',
  'ldap_permission_table_id2':'权限组名',
  'ldap_permission_table_id3':'组描述',
  'ldap_permission_backup':'返回',
  'ldap_permission_save':'保存权限',
  'ldap_permission_choise':'请先选择需要用户......',
  // System 设置
  'breadcrumb_system_crontablogs':'后台任务日志',
  'breadcrumb_system_crontab':'后台任务'

}











