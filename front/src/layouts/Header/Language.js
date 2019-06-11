import {PureComponent} from 'react';
import {
    Menu,Avatar,Dropdown
  } from 'antd'

import {formatMessage,setLocale} from 'umi/locale';

import css from '../index.less';
const {Item}=Menu


class CMDBLanguage extends PureComponent{
  constructor(props){
    super(props)
    this.state={
      // defaultLanguage:'zh-CN',
      languages:{
        "zh-CN":{flag:"🇨🇳",language:"中国-简体"},
        "zh-TW":{flag:"🇨🇳",language:"中国-繁体"},
        "en-US":{flag:"🇺🇸",language:"美国-英语"},
        "en-GB":{flag:"🇬🇧",language:"英国-英语"},
        "ja-JP":{flag:"🇯🇵",language:"日本-日语"},
      }
    }
  }
  handleChangeLanguages=(language)=>{
    setLocale(language.key)
  }
  render(){
    const {languages}=this.state
    const languageMenu=(<Menu onClick={this.handleChangeLanguages.bind(this)}>
      {Object.keys(languages).map(item => (
        <Item key={item}>
          {languages[item].flag}
          {languages[item].language}
        </Item>
      ))}
    </Menu>)
    return (
      <Dropdown overlay={languageMenu} placement="bottomRight">
        <span className={css.headerControlMenu}>
          <Avatar size="small" icon='global' className={css.languageAvater} ></Avatar>
        </span>
      </Dropdown>
      )
  }
}

export default CMDBLanguage