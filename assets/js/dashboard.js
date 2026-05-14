/* dashboard.js - Dashboard Specific JavaScript */
'use strict';

// ============================================
// DASHBOARD SIDEBAR MANAGER
// ============================================
const DashSidebar = (() => {
  const init = () => {
    const hamburger = document.querySelector('.dash-hamburger');
    const sidebar = document.querySelector('.dash-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!hamburger || !sidebar) return;

    const open = () => {
      sidebar.classList.add('open');
      overlay?.classList.add('show');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
      sidebar.classList.remove('open');
      overlay?.classList.remove('show');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', () => {
      sidebar.classList.contains('open') ? close() : open();
    });

    overlay?.addEventListener('click', close);

    // Active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.sidebar__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) link.classList.add('active');
    });
  };

  return { init };
})();

// ============================================
// CHART RENDERER (Canvas-free, CSS-based)
// ============================================
const ChartRenderer = (() => {
  const renderBarChart = (container, data) => {
    if (!container) return;
    const max = Math.max(...data.map(d => d.value));

    container.innerHTML = data.map(d => {
      const pct = max > 0 ? (d.value / max) * 100 : 0;
      return `
        <div class="chart-bar" style="height: ${pct}%" 
             title="${d.label}: ${d.value}"
             data-tooltip="${d.label}: ${d.value}">
        </div>`;
    }).join('');
  };

  const queryComplexityData = [
    { label: 'Mon', value: 42 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 55 },
    { label: 'Thu', value: 91 },
    { label: 'Fri', value: 63 },
    { label: 'Sat', value: 38 },
    { label: 'Sun', value: 29 },
    { label: 'Mon', value: 71 },
    { label: 'Tue', value: 85 },
    { label: 'Wed', value: 60 },
    { label: 'Thu', value: 48 },
    { label: 'Fri', value: 95 },
    { label: 'Sat', value: 33 },
    { label: 'Sun', value: 44 }
  ];

  const init = () => {
    const chartArea = document.querySelector('[data-chart="complexity"]');
    if (chartArea) renderBarChart(chartArea, queryComplexityData);
  };

  return { init };
})();

// ============================================
// QUERY PLAYGROUND
// ============================================
const QueryPlayground = (() => {
  const sampleQuery = `query GetProductCatalog {
  products(first: 10) {
    edges {
      node {
        id
        name
        price
        inventory {
          available
          warehouse
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

  const sampleResult = `{
  "data": {
    "products": {
      "edges": [
        {
          "node": {
            "id": "prod_01",
            "name": "API Design Kit",
            "price": 49.99,
            "inventory": {
              "available": 142,
              "warehouse": "US-WEST"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "cursor_xyz"
      }
    }
  }
}`;

  const init = () => {
    const queryInput = document.querySelector('[data-playground="query"]');
    const resultOutput = document.querySelector('[data-playground="result"]');
    const runBtn = document.querySelector('[data-playground="run"]');

    if (queryInput) queryInput.value = sampleQuery;
    if (resultOutput) resultOutput.textContent = '// Result will appear here...';

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        runBtn.disabled = true;

        setTimeout(() => {
          if (resultOutput) {
            resultOutput.textContent = sampleResult;
            resultOutput.style.animation = 'none';
            resultOutput.offsetHeight;
            resultOutput.style.animation = 'fadeIn 0.4s ease';
          }
          runBtn.innerHTML = '<i class="fas fa-play"></i> Run Query';
          runBtn.disabled = false;
        }, 800);
      });
    }

    // Format btn
    const formatBtn = document.querySelector('[data-playground="format"]');
    if (formatBtn) {
      formatBtn.addEventListener('click', () => {
        if (queryInput) {
          // Simple formatting simulation
          queryInput.style.animation = 'none';
          queryInput.offsetHeight;
          queryInput.style.animation = 'fadeIn 0.3s ease';
        }
      });
    }
  };

  return { init };
})();

// ============================================
// SCHEMA DRAFT DOWNLOAD
// ============================================
const SchemaDownload = (() => {
  const sampleSchema = `# GraphQL Federation Manifest
# Generated by GQLForge

type Query {
  products(first: Int, after: String): ProductConnection!
  product(id: ID!): Product
  users: [User!]!
  user(id: ID!): User
}

type Product @key(fields: "id") {
  id: ID!
  name: String!
  price: Float!
  inventory: Inventory
  reviews: [Review!]!
}

type Inventory @key(fields: "productId") {
  productId: ID!
  available: Int!
  warehouse: String!
}

type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
}

type Order {
  id: ID!
  items: [OrderItem!]!
  total: Float!
  status: OrderStatus!
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}`;

  const init = () => {
    document.querySelectorAll('[data-download="schema"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const blob = new Blob([sampleSchema], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'federation-manifest.graphql';
        a.click();
        URL.revokeObjectURL(url);

        btn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-download"></i> Download';
        }, 2000);
      });
    });
  };

  return { init };
})();

// ============================================
// NOTIFICATION SYSTEM
// ============================================
const Notifications = (() => {
  const notifications = [
    { id: 1, type: 'success', text: 'Schema draft "E-commerce v2" published', time: '2m ago' },
    { id: 2, type: 'warning', text: 'Query complexity threshold exceeded on resolver', time: '14m ago' },
    { id: 3, type: 'info', text: 'New federation manifest available for download', time: '1h ago' },
  ];

  let unread = notifications.length;

  const renderDropdown = () => {
    const dropdown = document.querySelector('[data-notif-dropdown]');
    if (!dropdown) return;

    dropdown.innerHTML = `
      <div style="padding: 14px 16px; border-bottom: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.9rem; font-weight: 600;">Notifications</span>
        <span class="badge badge--primary">${unread} new</span>
      </div>
      ${notifications.map(n => `
        <div style="padding: 12px 16px; border-bottom: 1px solid var(--clr-border); display: flex; gap: 10px; align-items: flex-start; cursor: pointer; transition: background var(--transition);"
             onmouseenter="this.style.background='var(--clr-glass)'"
             onmouseleave="this.style.background='transparent'">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--clr-${n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'primary'}); margin-top: 5px; flex-shrink: 0;"></div>
          <div>
            <div style="font-size: 0.82rem; color: var(--clr-text); margin-bottom: 2px;">${n.text}</div>
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--clr-text-faint);">${n.time}</div>
          </div>
        </div>
      `).join('')}
      <div style="padding: 10px 16px; text-align: center;">
        <a href="#" style="font-size: 0.82rem; color: var(--clr-primary);">View all notifications</a>
      </div>
    `;
  };

  const init = () => {
    const btn = document.querySelector('.notif-btn');
    const dropdown = document.querySelector('[data-notif-dropdown]');

    if (!btn || !dropdown) return;

    renderDropdown();

    let isOpen = false;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      dropdown.style.display = isOpen ? 'block' : 'none';

      if (isOpen) {
        unread = 0;
        const badge = btn.querySelector('.notif-badge');
        if (badge) badge.style.display = 'none';
      }
    });

    document.addEventListener('click', () => {
      if (isOpen) {
        isOpen = false;
        dropdown.style.display = 'none';
      }
    });
  };

  return { init };
})();

// ============================================
// DASHBOARD STATS LIVE ANIMATION
// ============================================
const LiveStats = (() => {
  const init = () => {
    // Simulate live query count
    const queryCountEl = document.querySelector('[data-live="queries"]');
    if (!queryCountEl) return;

    let base = 1284;
    setInterval(() => {
      base += Math.floor(Math.random() * 5);
      queryCountEl.textContent = base.toLocaleString();
    }, 3000);
  };

  return { init };
})();

// ============================================
// SETTINGS FORM
// ============================================
const SettingsManager = (() => {
  const init = () => {
    const saveBtn = document.querySelector('[data-settings="save"]');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', () => {
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      saveBtn.disabled = true;

      setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        setTimeout(() => {
          saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Settings';
          saveBtn.disabled = false;
        }, 2000);
      }, 1000);
    });
  };

  return { init };
})();

// ============================================
// INIT DASHBOARD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  DashSidebar.init();
  ChartRenderer.init();
  QueryPlayground.init();
  SchemaDownload.init();
  Notifications.init();
  LiveStats.init();
  SettingsManager.init();
});
