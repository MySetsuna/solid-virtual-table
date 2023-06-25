import { Component, useTransition } from 'solid-js';

import styles from './App.module.css';
import MainContent from './layout/MainContent/MainContent';
import Sider from './layout/Sider/Sider';

const App: Component = () => {
  
  return (
    <div class={styles.App}>
          <nav class={styles.nav}>
            <div class={styles.navContent}>
                virtual-table
            </div>
          </nav>
          <main class={styles.main}>
        <div class={styles.sider} ><Sider /></div>
              <div class={styles.content}>
          <MainContent  />
              </div>
          </main>
    </div>
  );
};

export default App;
