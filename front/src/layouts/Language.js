import {Component} from 'react';
import {
    Menu,Avatar,Dropdown
  } from 'antd'
import css from './index.less';
const {Item}=Menu
class CMDBLanguage extends Component{
  constructor(props){
    super(props)
    this.state={
      defaultLanguage:'zh-CN',
      languages:{
        "zh-CN":{flag:"🇨🇳",language:"中国-简体"},
        "zh-TW":{flag:"🇨🇳",language:"台湾-繁体"},
        "en-US":{flag:"🇺🇸",language:"美国-英语"},
        "en-GB":{flag:"🇬🇧",language:"英国-英语"},
        "ja-JP":{flag:"🇯🇵",language:"日本-日语"},
      }
    }
  }
  render(){
    const {languages,defaultLanguage}=this.state
    const languageMenu=(<Menu >
      {Object.keys(languages).map(item => (
        <Item key={item}>
          {languages[item].flag}
          {languages[item].language}
        </Item>
      ))}
    </Menu>)
    return (
      <Dropdown overlay={languageMenu} placement="bottomRight">
        <Menu
          onClick={""}
          // selectedKeys={[this.state.current]}
          mode="horizontal">
          {/* <Menu.Item key="languages" style={{padding:"0px 2px;"}}> */}
              <Avatar size="small" >{languages[defaultLanguage].flag}</Avatar>
          {/* </Menu.Item> */}
        </Menu>
      </Dropdown>
      )
  }
}

export default CMDBLanguage