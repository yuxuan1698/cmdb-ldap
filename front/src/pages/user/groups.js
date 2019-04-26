'use strict'

import {PureComponent} from 'react'
import { Layout,Tree,Input } from 'antd';
import {connect} from 'dva';
import { Resizable } from 'react-resizable';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";
import '../../../node_modules/react-resizable/css/styles.css';

const {
   Content, Sider
} = Layout;
const { TreeNode } = Tree;
const {Search} = Input;

@connect(({loading,groups})=>({loading,groups:groups.groups}))
class CMDBUserGroups extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      width:200,
      treeData: [],
    }
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps.groups)
    const groups=nextProps.groups,tmpGroups=[]
    Object.keys(groups).map(i=>{
      tmpGroups.push({title:groups[i][0].ou[0],key:groups[i][1]})
    })
    this.setState({treeData:tmpGroups})
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
  onLoadData = treeNode => new Promise((resolve) => {
    if (treeNode.props.children) {
      resolve();
      return;
    }
    setTimeout(() => {
      treeNode.props.dataRef.children = [
        { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
        { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
      ];
      this.setState({
        treeData: [...this.state.treeData],
      });
      resolve();
    }, 1000);
  })
  onResize=(event, { element, size })=>{
    this.setState({ width: size.width });
  }
  render(){
    return (<div className={usercss.userbody}>
      <CMDBBreadcrumb route={{'用户管理':"",'用户组列表':'/user/groups/'}} title='用户组列表'  />
      <div className={usercss.tableContent}> 
      <Layout>
        <Resizable axis="x"  minConstraints={[200,200]} width={this.state.width} onResize={this.onResize} >
          <Sider width={this.state.width} theme="light"  >
            <Search style={{ marginBottom: 8 }} placeholder="Search"  />
            <Tree loadData={this.onLoadData} showLine >
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          </Sider>
        </Resizable>
        <Content>main content</Content>
      </Layout>
      </div>
      </div>)
  }
}

export default CMDBUserGroups;