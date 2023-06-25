import { Routes, Route } from '@solidjs/router';
import type { Component } from 'solid-js';
import VirtualTable from '../../components/VirtualTable/VirtaulTable';
const MainContent: Component = () => {
  return <Routes>
  <Route path="/virtual-table" component={VirtualTable}/>
  <Route
    path="/about"
    element={<div>This site was made with Solid</div>}
  />
</Routes>;
};
export default MainContent;
