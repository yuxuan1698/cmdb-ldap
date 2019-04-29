'use strict'

import {PureComponent} from 'react'
import { Layout,Tree,Input,Button,Icon } from 'antd';
import {connect} from 'dva';
import { Resizable } from 'react-resizable';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";
import CMDBLDAPProfile from "../components/profile"
import '../../../node_modules/react-resizable/css/styles.css';

const {
   Content, Sider,Footer
} = Layout;
const ButtonGroup = Button.Group;
const { TreeNode } = Tree;
const {Search} = Input;

@connect(({loading,ldap})=>({loading,ldap:ldap.groups}))
class CMDBLdapGroups extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      width:250,
      treeData: [],
      treeobjects:{},
      loadedKeys:[]
    }
  }
  componentWillReceiveProps(nextProps){
    const ldap=nextProps.ldap,tmpldap=[],treeobject={}
    Object.keys(ldap).map(i=>{
      tmpldap.push({title:ldap[i][0].ou[0],dn:ldap[i][1],key:ldap[i][1]})
      treeobject[ldap[i][1]]=ldap[i][0]
    })
    this.setState({
      treeData:tmpldap,
      treeobjects:treeobject,
      selectdata:{}
    })
  }
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} dataRef={item} />;
  })
  onLoadData = treeNode => {
    return new Promise((resolve)=>{
      if (treeNode.props.children) {
        resolve();
        return;
      }
      const {dispatch} =this.props
      const curkey=treeNode.props.dataRef.key
      dispatch({'type':'ldap/getLDAPGroupsSecendList',payload:`${curkey}/`,callback:(data)=>{
        let list=[]
        Object.keys(data).map(i=>{
          const tt=data[i][1]
          list.push({
            'title':tt.split(',')[0].split('=')[1],
            'key':`${tt}`
          })
        })
        setTimeout(() => {
          treeNode.props.dataRef.children = list
          this.setState({
            treeData: [...this.state.treeData],
          });
          resolve();
        }, 10);
        // treeNode.props.dataRef.children=list
        // this.setState({
        //   treeData: [...this.state.treeData],
        // });
        // resolve()
      }})
    })
  }
  onResize=(event, { element, size })=>{
    this.setState({ width: size.width });
  }
  handleOnSelect=(selectkey,{selected,selectedNodes, node, event})=>{
    const {treeobjects}=this.state
    console.log()
    if(treeobjects.hasOwnProperty(selectkey)){
      this.setState({selectdata:treeobjects[selectkey]})
    }
  }
  render(){
    const {selectdata,width,treeData}=this.state
    return (
    <Layout className={usercss.userbody}>
      <CMDBBreadcrumb route={{'用户管理':"",'用户组列表':'/user/ldap/'}} title='用户组列表'  />
      <Layout style={{margin:"10px 0 0 0"}}>
        <Resizable axis="x"  minConstraints={[220,220]} width={width} onResize={this.onResize} >
          <Sider width={width} theme="light" >
            <Layout style={{height:"100%",padding:5,boxShadow:"0px 0px 3px #dcd8d8"}} >
              <Search style={{ marginBottom: 8 }} placeholder="Search"  />
              <Content style={{overflow:"auto",padding:"0px 3px",boxShadow:"0px 0px 3px #dcd8d8",backgroundColor:"#fff"}} >
                <Tree loadData={this.onLoadData} showLine showIcon
                  onSelect={this.handleOnSelect.bind(this)}>
                  {treeData.length?this.renderTreeNodes(treeData):'loading tree...'}
                </Tree>
              </Content>
              <Footer style={{padding:0,}}>
                <ButtonGroup size="small" >
                  <Button style={{height:22,fontSize:10,borderRadius:0}} icon='plus'>
                  </Button>
                  <Button style={{height:22,fontSize:10,borderRadius:0}} icon='minus'>
                  </Button>
                </ButtonGroup>
              </Footer>
            </Layout>
          </Sider>
        </Resizable>
        <Content style={{padding: 15,marginLeft:5, backgroundColor: "white"}}>
          <CMDBLDAPProfile />
        </Content>
      </Layout>
    </Layout>
    )
  }
}

export default CMDBLdapGroups;