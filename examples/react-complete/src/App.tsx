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
        prometheusUrl="/"
        queryHandler={async (x, y, z) => {
          const now = Date.now() / 1000; // Convert to seconds
          return {
            resultType: 'matrix',
            result: [
              {
                metric: {
                  __name__: 'cpu_usage',
                  instance: 'localhost:9090',
                  job: 'prometheus'
                },
                values: [
                  [now, '0.5'],
                  [now - 60, '0.6'],
                  [now - 60 * 2, '0.4'],
                  [now - 60 * 3, '0.5'],
                  [now - 60 * 4, '0.7'],
                  [now - 60 * 5, '0.8'],
                  [now - 60 * 6, '0.6'],
                  [now - 60 * 7, '0.5'],
                  [now - 60 * 8, '0.4'],
                  [now - 60 * 9, '0.5']
                ]
              }
            ]
          }
        }
        }
      />
    </div>
  );
}

export default App;
