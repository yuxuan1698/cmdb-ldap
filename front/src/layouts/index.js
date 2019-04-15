import styles from './index.css';

function BasicLayout(props) {
  if (props.location.pathname === '/login') {
    return <div>{ props.children }</div>
  }
  return (
    <div className={styles.normal}>
      {props.children}
    </div>
  );
}

export default BasicLayout;
