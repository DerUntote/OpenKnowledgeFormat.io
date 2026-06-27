/* ========================================================================
   OKF Interactive Showcase – Main JavaScript
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Mobile Navigation ─────────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  navToggle?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open);
  });

  document.querySelectorAll('[data-nav-mobile]').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });


  // ─── Scroll Reveal ─────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });


  // ─── Comparison Table Row Reveal ───────────────────────────────────
  const tableRows = document.querySelectorAll('#comparison-table tbody tr');
  const tableObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
        tableObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  tableRows.forEach(row => tableObserver.observe(row));


  // ─── Nav Active State ──────────────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav__link[data-nav]');
  const sections = [];

  navLinks.forEach(link => {
    const id = link.getAttribute('href')?.replace('#', '');
    const section = document.getElementById(id);
    if (section) sections.push({ id, el: section, link });
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('nav__link--active'));
        const active = sections.find(s => s.id === entry.target.id);
        if (active) active.link.classList.add('nav__link--active');
      }
    });
  }, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(s => navObserver.observe(s.el));


  // ─── Step Glow on Scroll ───────────────────────────────────────────
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.step').forEach(step => stepObserver.observe(step));


  // ─── Hero Typewriter ───────────────────────────────────────────────
  const typewriterTarget = document.getElementById('typewriter-target');

  const typewriterLines = [
    { text: '---',                                      cls: 'syn-delim' },
    { text: 'type: ',         val: 'Metric',            cls: 'syn-key', vcls: 'syn-value' },
    { text: 'title: ',        val: 'Monthly Recurring Revenue', cls: 'syn-key', vcls: 'syn-string' },
    { text: 'description: ',  val: 'Recurring subscription revenue normalized to a monthly period.', cls: 'syn-key', vcls: 'syn-string' },
    { text: 'resource: ',     val: 'dashboard://revenue/mrr',   cls: 'syn-key', vcls: 'syn-string' },
    { text: 'tags: ',         val: '[revenue, saas, finance]',  cls: 'syn-key', vcls: 'syn-value' },
    { text: 'timestamp: ',    val: '2026-06-13T00:00:00Z',      cls: 'syn-key', vcls: 'syn-value' },
    { text: '---',                                      cls: 'syn-delim' },
    { text: '' },
    { text: '# Calculation',                            cls: 'syn-heading' },
    { text: '' },
    { text: 'MRR is the predictable recurring revenue' },
    { text: 'from the [subscriptions table](/tables/subscriptions.md).', cls: null, linkParts: true },
    { text: '' },
    { text: '# Citations',                              cls: 'syn-heading' },
    { text: '' },
    { text: '[1] [Revenue dashboard](dashboard://revenue/mrr)', cls: 'syn-link' },
  ];

  class Typewriter {
    constructor(target, lines, speed = 18) {
      this.target = target;
      this.lines = lines;
      this.speed = speed;
      this.lineIdx = 0;
      this.charIdx = 0;
      this.cursor = document.createElement('span');
      this.cursor.className = 'typewriter-cursor';
      this.cursor.textContent = '\u200B';
      this.started = false;
    }

    start() {
      if (this.started) return;
      this.started = true;
      this.target.innerHTML = '';
      this.target.appendChild(this.cursor);
      this.tick();
    }

    tick() {
      if (this.lineIdx >= this.lines.length) {
        this.cursor.remove();
        return;
      }

      const line = this.lines[this.lineIdx];
      const fullText = line.val ? line.text + line.val : line.text;

      if (this.charIdx === 0 && this.lineIdx > 0) {
        this.target.insertBefore(document.createTextNode('\n'), this.cursor);
      }

      if (this.charIdx < fullText.length) {
        const char = fullText[this.charIdx];
        let span;

        if (line.val && this.charIdx >= line.text.length) {
          // Value part
          if (this.charIdx === line.text.length) {
            span = document.createElement('span');
            span.className = line.vcls || '';
            this.target.insertBefore(span, this.cursor);
          } else {
            span = this.cursor.previousSibling;
          }
          span.textContent += char;
        } else if (line.cls) {
          // Key/tag part
          if (this.charIdx === 0) {
            span = document.createElement('span');
            span.className = line.cls;
            this.target.insertBefore(span, this.cursor);
          } else {
            span = this.cursor.previousSibling;
            if (span.nodeType === 3) {
              // text node, wrap it
              span = document.createElement('span');
              span.className = line.cls;
              this.target.insertBefore(span, this.cursor);
            }
          }
          span.textContent += char;
        } else {
          // Plain text
          const textNode = this.cursor.previousSibling;
          if (textNode && textNode.nodeType === 3) {
            textNode.textContent += char;
          } else {
            this.target.insertBefore(document.createTextNode(char), this.cursor);
          }
        }

        this.charIdx++;
        const delay = char === '\n' ? this.speed * 4 : this.speed + Math.random() * 12;
        setTimeout(() => this.tick(), delay);
      } else {
        this.charIdx = 0;
        this.lineIdx++;
        setTimeout(() => this.tick(), this.speed * 3);
      }
    }
  }

  // Start typewriter when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => new Typewriter(typewriterTarget, typewriterLines, 16).start(), 600);
      heroObserver.disconnect();
    }
  }, { threshold: 0.2 });

  if (typewriterTarget) {
    heroObserver.observe(typewriterTarget.closest('.hero__code-wrapper'));
  }


  // ─── Concept Explorer ──────────────────────────────────────────────
  const explorerFiles = {
    'index.md': {
      type: 'index',
      links: ['metrics/monthly-recurring-revenue.md', 'tables/subscriptions.md', 'playbooks/revenue-review.md'],
      content: `<span class="syn-delim">---</span>
<span class="syn-key">okf_version</span>: <span class="syn-string">"0.1"</span>
<span class="syn-delim">---</span>

<span class="syn-heading"># Metrics</span>

* [Monthly Recurring Revenue](<span class="syn-link">metrics/monthly-recurring-revenue.md</span>)

<span class="syn-heading"># Tables</span>

* [Subscriptions](<span class="syn-link">tables/subscriptions.md</span>)

<span class="syn-heading"># Playbooks</span>

* [Revenue Review](<span class="syn-link">playbooks/revenue-review.md</span>)`
    },
    'log.md': {
      type: 'log',
      links: ['metrics/monthly-recurring-revenue.md', 'tables/subscriptions.md'],
      content: `<span class="syn-heading"># Directory Update Log</span>

<span class="syn-heading">## 2026-06-13</span>
* <span class="syn-key">Creation</span>: Added the [MRR metric](<span class="syn-link">metrics/monthly-recurring-revenue.md</span>).
* <span class="syn-key">Update</span>: Linked MRR to the [subscriptions table](<span class="syn-link">tables/subscriptions.md</span>).`
    },
    'metrics/monthly-recurring-revenue.md': {
      type: 'concept',
      links: ['tables/subscriptions.md'],
      content: `<span class="syn-delim">---</span>
<span class="syn-key">type</span>: <span class="syn-value">Metric</span>
<span class="syn-key">title</span>: <span class="syn-string">Monthly Recurring Revenue</span>
<span class="syn-key">description</span>: <span class="syn-string">Recurring subscription revenue normalized to a monthly period.</span>
<span class="syn-key">resource</span>: <span class="syn-string">dashboard://revenue/mrr</span>
<span class="syn-key">tags</span>: <span class="syn-value">[revenue, saas, finance]</span>
<span class="syn-key">timestamp</span>: <span class="syn-value">2026-06-13T00:00:00Z</span>
<span class="syn-delim">---</span>

<span class="syn-heading"># Calculation</span>

MRR is the predictable recurring revenue generated by
active subscriptions in the [subscriptions table](<span class="syn-link">/tables/subscriptions.md</span>).

Include active subscriptions with recurring billing.
Exclude one-time setup fees, refunds, and usage-only charges.

<span class="syn-heading"># Examples</span>

<span class="syn-comment">SELECT</span> <span class="syn-key">sum</span>(monthly_amount_usd) <span class="syn-comment">AS</span> mrr
<span class="syn-comment">FROM</span> analytics.subscriptions
<span class="syn-comment">WHERE</span> status = <span class="syn-string">'active'</span>;

<span class="syn-heading"># Citations</span>

[1] [Revenue dashboard](<span class="syn-link">dashboard://revenue/mrr</span>)`
    },
    'tables/subscriptions.md': {
      type: 'concept',
      links: ['metrics/monthly-recurring-revenue.md', 'playbooks/revenue-review.md'],
      content: `<span class="syn-delim">---</span>
<span class="syn-key">type</span>: <span class="syn-value">Warehouse Table</span>
<span class="syn-key">title</span>: <span class="syn-string">Subscriptions</span>
<span class="syn-key">description</span>: <span class="syn-string">One row per customer subscription and billing state.</span>
<span class="syn-key">resource</span>: <span class="syn-string">warehouse://analytics.subscriptions</span>
<span class="syn-key">tags</span>: <span class="syn-value">[warehouse, subscriptions, revenue]</span>
<span class="syn-key">timestamp</span>: <span class="syn-value">2026-06-13T00:00:00Z</span>
<span class="syn-delim">---</span>

<span class="syn-heading"># Schema</span>

| Column              | Type    | Description                          |
|---------------------|---------|--------------------------------------|
| subscription_id     | string  | Unique subscription identifier.      |
| customer_id         | string  | Customer that owns the subscription. |
| status              | string  | Current billing state.               |
| monthly_amount_usd  | decimal | Normalized monthly recurring amount. |

<span class="syn-heading"># Related concepts</span>

Feeds the [Monthly Recurring Revenue](<span class="syn-link">/metrics/monthly-recurring-revenue.md</span>)
metric and the [Revenue Review](<span class="syn-link">/playbooks/revenue-review.md</span>) playbook.`
    },
    'playbooks/revenue-review.md': {
      type: 'concept',
      links: ['metrics/monthly-recurring-revenue.md', 'tables/subscriptions.md'],
      content: `<span class="syn-delim">---</span>
<span class="syn-key">type</span>: <span class="syn-value">Playbook</span>
<span class="syn-key">title</span>: <span class="syn-string">Revenue Review</span>
<span class="syn-key">description</span>: <span class="syn-string">Weekly review process for subscription revenue changes.</span>
<span class="syn-key">tags</span>: <span class="syn-value">[playbook, revenue, weekly]</span>
<span class="syn-key">timestamp</span>: <span class="syn-value">2026-06-13T00:00:00Z</span>
<span class="syn-delim">---</span>

<span class="syn-heading"># Purpose</span>

Weekly review to monitor MRR changes, investigate anomalies,
and update forecasts using the
[MRR metric](<span class="syn-link">/metrics/monthly-recurring-revenue.md</span>).

<span class="syn-heading"># Steps</span>

1. Pull current MRR from the [subscriptions table](<span class="syn-link">/tables/subscriptions.md</span>).
2. Compare against previous week.
3. Flag accounts with >10% change.
4. Update revenue forecast.

<span class="syn-heading"># Schedule</span>

Every Monday, 09:00 UTC.`
    }
  };

  const fileTreeEl = document.getElementById('file-tree');
  const explorerContent = document.getElementById('explorer-content');
  const explorerFilename = document.getElementById('explorer-filename');
  const explorerFiletype = document.getElementById('explorer-filetype');

  // File icons
  const iconFolder = `<svg class="file-tree__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
  const iconFile = `<svg class="file-tree__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

  function buildFileTree() {
    if (!fileTreeEl) return;

    const structure = [
      { name: 'okf/', isDir: true, depth: 0 },
      { name: 'index.md', key: 'index.md', depth: 1 },
      { name: 'log.md', key: 'log.md', depth: 1 },
      { name: 'metrics/', isDir: true, depth: 1 },
      { name: 'monthly-recurring-revenue.md', key: 'metrics/monthly-recurring-revenue.md', depth: 2 },
      { name: 'playbooks/', isDir: true, depth: 1 },
      { name: 'revenue-review.md', key: 'playbooks/revenue-review.md', depth: 2 },
      { name: 'tables/', isDir: true, depth: 1 },
      { name: 'subscriptions.md', key: 'tables/subscriptions.md', depth: 2 },
    ];

    structure.forEach(item => {
      const el = document.createElement('div');
      el.className = 'file-tree__item' + (item.key === 'index.md' ? ' file-tree__item--active' : '');

      // Indentation
      for (let i = 0; i < item.depth; i++) {
        const indent = document.createElement('span');
        indent.className = 'file-tree__indent';
        el.appendChild(indent);
      }

      el.innerHTML += (item.isDir ? iconFolder : iconFile) + ' ' + item.name;

      if (item.key) {
        el.dataset.file = item.key;
        el.addEventListener('click', () => selectFile(item.key));
      } else {
        el.style.cursor = 'default';
        el.style.color = 'var(--text-dim)';
      }

      fileTreeEl.appendChild(el);
    });

    // Show initial file
    selectFile('index.md');
  }

  function selectFile(key) {
    const file = explorerFiles[key];
    if (!file || !explorerContent) return;

    // Update active state in tree
    fileTreeEl.querySelectorAll('.file-tree__item').forEach(item => {
      item.classList.remove('file-tree__item--active', 'file-tree__item--linked');
    });

    const activeItem = fileTreeEl.querySelector(`[data-file="${key}"]`);
    if (activeItem) activeItem.classList.add('file-tree__item--active');

    // Highlight linked files
    (file.links || []).forEach(linked => {
      const linkedItem = fileTreeEl.querySelector(`[data-file="${linked}"]`);
      if (linkedItem) linkedItem.classList.add('file-tree__item--linked');
    });

    // Animate content switch
    explorerContent.classList.add('is-switching');
    setTimeout(() => {
      explorerContent.innerHTML = file.content;
      explorerFilename.textContent = key;
      explorerFiletype.textContent = file.type === 'concept' ? 'okf concept' : file.type;
      explorerContent.classList.remove('is-switching');
    }, 150);
  }

  buildFileTree();


  // ─── Live Playground ───────────────────────────────────────────────
  const playgroundInput = document.getElementById('playground-input');
  const playgroundOutput = document.getElementById('playground-output');
  const playgroundStatus = document.getElementById('playground-status');
  const playgroundStatusText = document.getElementById('playground-status-text');
  const playgroundCharCount = document.getElementById('playground-char-count');

  const presets = {
    metric: `---
type: Metric
title: Monthly Recurring Revenue
description: Recurring subscription revenue normalized to a monthly period.
resource: dashboard://revenue/mrr
tags: [revenue, saas, finance]
timestamp: 2026-06-13T00:00:00Z
---

# Calculation

MRR is the predictable recurring revenue generated by active subscriptions in the [subscriptions table](/tables/subscriptions.md).

Include active subscriptions with recurring billing. Exclude one-time setup fees, refunds, and usage-only charges.

# Examples

\`\`\`sql
select sum(monthly_amount_usd) as mrr
from analytics.subscriptions
where status = 'active';
\`\`\`

# Citations

[1] [Revenue dashboard](dashboard://revenue/mrr)`,
    table: `---
type: Warehouse Table
title: Subscriptions
description: One row per customer subscription and billing state.
resource: warehouse://analytics.subscriptions
tags: [warehouse, subscriptions, revenue]
timestamp: 2026-06-13T00:00:00Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| subscription_id | string | Unique subscription identifier. |
| customer_id | string | Customer that owns the subscription. |
| status | string | Current billing state. |
| monthly_amount_usd | decimal | Normalized monthly recurring amount. |

# Related concepts

Feeds the [Monthly Recurring Revenue](/metrics/mrr.md) metric.`,
    endpoint: `---
type: API Endpoint
title: Create Customer
description: Creates a new customer record.
resource: https://api.example.com/customers
method: POST
path: /api/customers
tags: [api, customers]
timestamp: 2026-06-13T00:00:00Z
---

# Request

Accepts a customer payload shaped by the [Customer schema](/schemas/customer.md).

# Response

Returns the created customer object or a [rate limit error](/errors/rate-limit.md).

# Examples

\`\`\`http
POST /api/customers
Content-Type: application/json

{
  "name": "Acme Inc.",
  "email": "billing@acme.com"
}
\`\`\``,
    policy: `---
type: Policy
title: Refund Policy
description: Rules support and billing teams use when evaluating customer refund requests.
resource: docs://policies/refunds
tags: [support, billing, policy]
timestamp: 2026-06-13T00:00:00Z
---

# Purpose

The refund policy defines when support can approve a refund, when billing review is required, and which cases must be escalated.

# Decision points

* Check whether the customer has an active subscription in the [billing system](/systems/billing.md).
* Escalate disputes through the [incident response playbook](/playbooks/incident-response.md).

# Citations

[1] [Refund policy source](docs://policies/refunds)`,
    boundary: `---
type: Boundary
title: Checkout API
technology: Quarkus JAX-RS
domain: ordering
tags: [boundary, api, checkout]
timestamp: 2026-06-27T10:00:00Z
---

# Checkout API

Receives incoming purchase requests from the web frontend and validates the payload.

## Delegation

Delegates processing to the [Order Workflow Context](../context/order-workflow.md).

## Emits

Publishes the [Order Placed Event](../../events/order-placed.md) to Kafka upon success.`,
    empty: ''
  };

  // Load initial preset
  if (playgroundInput) {
    playgroundInput.value = presets.metric;
    parsePlayground();
  }

  // Preset buttons
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.playground__preset').forEach(b => b.classList.remove('playground__preset--active'));
      btn.classList.add('playground__preset--active');
      playgroundInput.value = presets[btn.dataset.preset] || '';
      parsePlayground();
    });
  });

  // Live parsing on input
  playgroundInput?.addEventListener('input', debounce(parsePlayground, 150));

  function parsePlayground() {
    const raw = playgroundInput.value;
    if (playgroundCharCount) {
      playgroundCharCount.textContent = raw.length + ' chars';
    }

    if (!raw.trim()) {
      playgroundOutput.innerHTML = '<p class="text-muted" style="font-style:italic">Start typing or load a preset…</p>';
      setStatus('empty', 'Waiting for input');
      return;
    }

    // Split frontmatter and body
    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

    if (!fmMatch) {
      // No frontmatter delimiters
      playgroundOutput.innerHTML = '<div class="preview-body">' + renderMarkdown(raw) + '</div>';
      setStatus('invalid', 'Missing YAML frontmatter (--- delimiters)');
      return;
    }

    const yamlStr = fmMatch[1];
    const body = fmMatch[2];

    // Parse YAML
    let meta;
    try {
      meta = jsyaml.load(yamlStr);
    } catch (e) {
      playgroundOutput.innerHTML = '<p style="color:var(--error)">YAML parse error: ' + escapeHtml(e.message) + '</p>';
      setStatus('invalid', 'YAML parse error');
      return;
    }

    if (!meta || typeof meta !== 'object') {
      playgroundOutput.innerHTML = '<p style="color:var(--error)">Frontmatter must be a YAML mapping (key: value pairs).</p>';
      setStatus('invalid', 'Frontmatter is not a YAML mapping');
      return;
    }

    // Validate: type is required
    const hasType = meta.type && String(meta.type).trim().length > 0;

    // Render metadata table
    let metaHtml = '<div class="preview-meta"><table class="preview-meta__table">';
    for (const [k, v] of Object.entries(meta)) {
      const val = Array.isArray(v) ? v.join(', ') : String(v);
      metaHtml += `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(val)}</td></tr>`;
    }
    metaHtml += '</table></div>';

    // Render body
    const bodyHtml = body.trim() ? '<div class="preview-body">' + renderMarkdown(body) + '</div>' : '';

    playgroundOutput.innerHTML = metaHtml + bodyHtml;

    if (hasType) {
      setStatus('valid', 'Valid OKF concept · type: ' + meta.type);
    } else {
      setStatus('invalid', 'Missing required field: type');
    }
  }

  function setStatus(state, text) {
    if (!playgroundStatus) return;
    playgroundStatus.className = 'playground__status playground__status--' + state;
    playgroundStatusText.textContent = text;
  }


  // ─── Simple Markdown Renderer ──────────────────────────────────────
  function renderMarkdown(md) {
    let html = escapeHtml(md);

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return '<pre><code>' + code.trim() + '</code></pre>';
    });

    // Tables
    html = html.replace(/((?:\|.*\|\r?\n){2,})/g, (table) => {
      const rows = table.trim().split('\n').filter(r => r.trim());
      if (rows.length < 2) return table;

      let tableHtml = '<table>';
      rows.forEach((row, i) => {
        // Skip separator row
        if (row.match(/^\|[\s\-:|]+\|$/)) return;

        const cells = row.split('|').filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
        const tag = i === 0 ? 'th' : 'td';
        const wrap = i === 0 ? 'thead' : (i === 1 ? 'tbody' : '');

        if (i === 0) tableHtml += '<thead>';
        if (i === 1) tableHtml += '</thead><tbody>';

        tableHtml += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
      });
      tableHtml += '</tbody></table>';
      return tableHtml;
    });

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Lists
    html = html.replace(/^[*\-] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Paragraphs – wrap remaining non-tag lines
    html = html.split('\n\n').map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<')) return block;
      return '<p>' + block.replace(/\n/g, ' ') + '</p>';
    }).join('\n');

    return html;
  }


  // ─── Utilities ─────────────────────────────────────────────────────
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }


  // ─── Copy Buttons ──────────────────────────────────────────────────
  document.querySelectorAll('.code-frame__copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.copyCode;
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const textToCopy = codeEl.textContent || codeEl.innerText;

      const onSuccess = () => {
        btn.textContent = 'Copied!';
        btn.classList.add('code-frame__copy--success');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('code-frame__copy--success');
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy)
          .then(onSuccess)
          .catch(err => console.error('Failed to copy: ', err));
      } else {
        // Fallback for file:// or insecure contexts
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed'; // Avoid scrolling to bottom
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          onSuccess();
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textarea);
      }
    });
  });

  // ─── Theme Toggle ──────────────────────────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  
  const savedTheme = localStorage.getItem('okf-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  function toggleTheme(e) {
    if (e) e.preventDefault();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('okf-theme', newTheme);
  }

  themeToggle?.addEventListener('click', toggleTheme);
  themeToggleMobile?.addEventListener('click', toggleTheme);

});
