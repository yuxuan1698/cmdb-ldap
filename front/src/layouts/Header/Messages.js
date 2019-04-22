import {PureComponent} from 'react';
import {
    Menu,Icon,Dropdown,Badge,Tabs,List,Avatar
  } from 'antd'
import css from '../index.less';
// const {Item}=Menu
const TabPane=Tabs.TabPane

class CMDBMessages extends PureComponent{
  constructor(props){
    super(props)
    this.state={
      // defaultLanguage:'zh-CN',
      msgNum: 51,
      languages:{
        "zh-CN":{flag:"🇨🇳",language:"中国-简体"},
        "zh-TW":{flag:"🇨🇳",language:"台湾-繁体"},
        "en-US":{flag:"🇺🇸",language:"美国-英语"},
        "en-GB":{flag:"🇬🇧",language:"英国-英语"},
        "ja-JP":{flag:"🇯🇵",language:"日本-日语"},
      }
    }
    
  }
  changeNum(){
    // alert()
    this.setState({msgNum: parseInt(Math.random()*100,10)})
  }
  componentDidMount() {
    const tt=setInterval(this.changeNum.bind(this), 2000);
  }
  // componentWillUnmount() {
  //   // clearInterval(tt)
  // }
  
  render(){
    const {languages}=this.state
    const data = [
      {
        title: 'Ant Design Title 1',
      },
      {
        title: 'Ant Design Title 2',
      },
      {
        title: 'Ant Design Title 3',
      },
      {
        title: 'Ant Design Title 4',
      },
    ];
    const languageMenu=(<Menu >
      <Tabs defaultActiveKey="1" style={{ width: 300 }} tabBarStyle={{textAlign:"center"}} size='small'>
        <TabPane tab="消息(1)" key="1">
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
            </List.Item>
          )}
        />
        </TabPane>
        <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
        <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
      </Tabs>
    </Menu>)
    return (
      <Dropdown overlay={languageMenu} trigger={['click']} placement="bottomRight">
        <span className={css.headerControlMenu}>
          <Badge 
            count={this.state.msgNum} 
            overflowCount={100} 
            style={{boxShadow: "3px 3px 4px #d4d2d2",background: '#f55922',padding:0}}>
            <Icon type="bell" theme="filled" style={{fontSize:18}} />
          </Badge>
        </span>
      </Dropdown>
      )
  }
}

export default CMDBMessages