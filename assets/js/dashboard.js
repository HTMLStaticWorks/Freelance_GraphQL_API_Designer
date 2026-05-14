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

    // Section Switching Logic
    const sections = document.querySelectorAll('.dash-section');
    const navLinks = document.querySelectorAll('.sidebar__link');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetSectionId = link.getAttribute('data-section');
        if (!targetSectionId) return;

        e.preventDefault();

        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Update active section
        sections.forEach(section => {
          section.classList.remove('active');
          if (section.id === targetSectionId) {
            section.classList.add('active');
            
            // Re-render chart if overview is shown
            if (targetSectionId === 'overview') {
              ChartRenderer.init();
            }
          }
        });

        // Close sidebar on mobile
        if (window.innerWidth < 1024) close();

        // Update page title in header
        const pageTitle = document.querySelector('.dash-header__title');
        if (pageTitle) {
          const sectionTitle = link.innerText.trim();
          pageTitle.textContent = `Schema Dashboard — ${sectionTitle}`;
        }
      });
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
    const queryInputs = document.querySelectorAll('[data-playground="query"]');
    const resultOutputs = document.querySelectorAll('[data-playground="result"]');
    const runBtns = document.querySelectorAll('[data-playground="run"]');

    queryInputs.forEach(input => { if (!input.value) input.value = sampleQuery; });
    resultOutputs.forEach(output => { if (!output.textContent) output.textContent = '// Result will appear here...'; });

    runBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        btn.disabled = true;

        setTimeout(() => {
          const resultOutput = resultOutputs[idx] || resultOutputs[0];
          if (resultOutput) {
            resultOutput.textContent = sampleResult;
            resultOutput.style.animation = 'none';
            resultOutput.offsetHeight;
            resultOutput.style.animation = 'fadeIn 0.4s ease';
          }
          btn.innerHTML = '<i class="fas fa-play"></i> Run Query';
          btn.disabled = false;
        }, 800);
      });
    });

    // Format btn
    document.querySelectorAll('[data-playground="format"]').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const queryInput = queryInputs[idx] || queryInputs[0];
        if (queryInput) {
          queryInput.style.animation = 'none';
          queryInput.offsetHeight;
          queryInput.style.animation = 'fadeIn 0.3s ease';
        }
      });
    });
  };

  return { init };
})();

// ============================================
// SCHEMA DRAFTS DOWNLOAD
// ============================================
const SchemaDownload = (() => {
  const sampleSchema = `# GraphQL Federation Manifest\n# Generated by GQLForge\n\ntype Query {\n  products: [Product!]\n}`;

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
    { id: 2, type: 'warning', text: 'Query complexity threshold exceeded', time: '14m ago' },
  ];

  const init = () => {
    const btn = document.querySelector('.notif-btn');
    const dropdown = document.querySelector('[data-notif-dropdown]');

    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShowing = dropdown.style.display === 'block';
      dropdown.style.display = isShowing ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
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
});
