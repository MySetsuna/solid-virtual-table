import type { Component } from 'solid-js';
import styles from './Sider.module.css';

import { A } from '@solidjs/router';
const Sider: Component = () => {
  return (
    <div class={styles.siderBox}>
      <A href="/about">About</A>
      <A href="/virtual-table">VirtualTable</A>
    </div>
  );
};
export default Sider;
