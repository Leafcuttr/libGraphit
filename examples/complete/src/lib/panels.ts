// Sample Grafana panel configurations for demonstration

export const cpuUsagePanel = {
  id: 1,
  title: 'CPU Usage Over Time',
  type: 'timeseries',
  targets: [
    {
      expr: '100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)',
      refId: 'A',
      legendFormat: '{{instance}} CPU Usage',
      interval: '30s'
    }
  ],
  fieldConfig: {
    defaults: {
      unit: 'percent',
      displayName: 'CPU Usage %',
      min: 0,
      max: 100
    }
  },
  options: {
    tooltip: {
      mode: 'multi'
    },
    legend: {
      displayMode: 'table',
      placement: 'bottom'
    }
  },
  gridPos: {
    h: 8,
    w: 12,
    x: 0,
    y: 0
  }
};

export const memoryUsagePanel = {
  id: 2,
  title: 'Memory Usage',
  type: 'timeseries',
  targets: [
    {
      expr: '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100',
      refId: 'A',
      legendFormat: '{{instance}} Memory Usage',
      interval: '30s'
    }
  ],
  fieldConfig: {
    defaults: {
      unit: 'percent',
      displayName: 'Memory Usage %',
      min: 0,
      max: 100
    }
  },
  options: {
    tooltip: {
      mode: 'single'
    },
    legend: {
      displayMode: 'list',
      placement: 'bottom'
    }
  },
  gridPos: {
    h: 8,
    w: 12,
    x: 12,
    y: 0
  }
};

export const diskIOPanel = {
  id: 3,
  title: 'Disk I/O Rate',
  type: 'timeseries',
  targets: [
    {
      expr: 'irate(node_disk_read_bytes_total[5m])',
      refId: 'A',
      legendFormat: '{{instance}} - {{device}} Read',
      interval: '30s'
    },
    {
      expr: 'irate(node_disk_written_bytes_total[5m])',
      refId: 'B',
      legendFormat: '{{instance}} - {{device}} Write',
      interval: '30s'
    }
  ],
  fieldConfig: {
    defaults: {
      unit: 'bytes',
      displayName: 'Bytes/sec'
    }
  },
  options: {
    tooltip: {
      mode: 'multi'
    },
    legend: {
      displayMode: 'table',
      placement: 'bottom'
    }
  },
  gridPos: {
    h: 8,
    w: 24,
    x: 0,
    y: 8
  }
};

export const networkTrafficPanel = {
  id: 4,
  title: 'Network Traffic',
  type: 'timeseries',
  targets: [
    {
      expr: 'irate(node_network_receive_bytes_total{device!="lo"}[5m])',
      refId: 'A',
      legendFormat: '{{instance}} - {{device}} Received',
      interval: '30s'
    },
    {
      expr: 'irate(node_network_transmit_bytes_total{device!="lo"}[5m])',
      refId: 'B',
      legendFormat: '{{instance}} - {{device}} Transmitted',
      interval: '30s'
    }
  ],
  fieldConfig: {
    defaults: {
      unit: 'bytes',
      displayName: 'Bytes/sec'
    }
  },
  options: {
    tooltip: {
      mode: 'multi'
    },
    legend: {
      displayMode: 'table',
      placement: 'bottom'
    }
  },
  gridPos: {
    h: 8,
    w: 12,
    x: 0,
    y: 16
  }
};

export const uptimePanel = {
  id: 5,
  title: 'System Uptime',
  type: 'stat',
  targets: [
    {
      expr: 'node_time_seconds - node_boot_time_seconds',
      refId: 'A',
      legendFormat: '{{instance}} Uptime',
      interval: '60s'
    }
  ],
  fieldConfig: {
    defaults: {
      unit: 'seconds',
      displayName: 'Uptime'
    }
  },
  options: {
    reduceOptions: {
      values: false,
      calcs: ['lastNotNull'],
      fields: ''
    },
    orientation: 'auto',
    textMode: 'auto',
    colorMode: 'value',
    graphMode: 'area',
    justifyMode: 'auto'
  },
  gridPos: {
    h: 8,
    w: 12,
    x: 12,
    y: 16
  }
};

export const allPanels = [
  cpuUsagePanel,
  memoryUsagePanel,
  diskIOPanel,
  networkTrafficPanel,
  uptimePanel
];