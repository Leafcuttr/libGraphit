import { GrafanaDashboard } from '@leafcuttr/libgraphit-react';
import type { GrafanaDashboard as GrafanaDashboardType } from '@leafcuttr/libgraphit-core';
import dashboard from './sample-dashboard.json';
import './App.css';

function App() {
  return (
    <div>
      <h1>libGraphit React Example</h1>
      <GrafanaDashboard
        dashboardJson={dashboard as GrafanaDashboardType}
        prometheusUrl="http://localhost:9090"
      />
    </div>
  );
}

export default App;
