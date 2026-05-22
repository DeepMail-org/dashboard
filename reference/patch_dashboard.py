import re

with open('deepmail-dashboard.html', 'r') as f:
    content = f.read()

# 1. Update Sidebar
new_sidebar = """    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <div class="brand-icon" style="background: linear-gradient(135deg, #a855f7, #6366f1); box-shadow: 0 0 12px rgba(168,85,247,0.4);"></div>
        <span style="font-weight: 700; letter-spacing: -0.02em;">DeepMail</span>
      </div>
      
      <div style="margin: 0 8px 24px 8px; position: relative;">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Search..." style="width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 6px; padding: 8px 8px 8px 32px; color: var(--fg); font-size: 13px; font-family: var(--font-body); outline: none;" />
        <div style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 10px; color: var(--muted); background: rgba(255,255,255,0.05); padding: 2px 4px; border-radius: 4px;">⌘K</div>
      </div>

      <div class="nav-group">Main</div>
      <nav class="nav-menu" style="flex: 1;">
        <a href="deepmail-dashboard.html" class="nav-item active"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg><span>Dashboard</span></a>
        <a href="mail-inbox.html" class="nav-item"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><span>Mail Inbox</span><span style="margin-left:auto; background:#a855f7; color:#fff; font-size:10px; padding:2px 6px; border-radius:10px; font-weight:600;">12</span></a>
        <a href="cases.html" class="nav-item"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg><span>Cases</span></a>
        <a href="cases-board.html" class="nav-item"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg><span>Case Board</span></a>
        <a href="detections.html" class="nav-item"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Detections</span></a>
        <a href="sandbox.html" class="nav-item"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg><span>Sandbox</span></a>
      </nav>
      
      <div class="nav-group">Insights</div>
      <nav class="nav-menu">
        <a href="log-explorer.html" class="nav-item"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span>Log Explorer</span></a>
        <a href="graph-analysis.html" class="nav-item"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg><span>Graph Analysis</span></a>
      </nav>

      <div class="nav-group">System</div>
      <nav class="nav-menu" style="margin-bottom: 20px;">
        <a href="marketplace.html" class="nav-item"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><span>Marketplace</span></a>
        <a href="billing.html" class="nav-item"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg><span>Billing</span></a>
        <a href="settings.html" class="nav-item"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg><span>Settings</span></a>
      </nav>

      <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border);">
        <div class="user-profile" style="background: transparent; border: none; padding: 8px; justify-content: space-between; width: 100%;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--surface-hover); display: grid; place-items: center; border: 1px solid var(--border);">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div style="display: flex; flex-direction: column;">
              <span style="font-weight: 500; font-size: 13px; color: var(--fg);">Admin User</span>
              <span style="font-size: 11px; color: var(--muted);">admin@deepmail.io</span>
            </div>
          </div>
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--muted);"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </div>
      </div>
    </aside>"""

content = re.sub(r'<aside class="sidebar" id="sidebar">.*?</aside>', new_sidebar, content, flags=re.DOTALL)

# 2. Add Area Chart
area_chart_html = """
        <!-- New Area Chart Widget -->
        <div class="grid-4" style="margin-bottom: 24px;">
          <div class="card" style="grid-column: 1 / -1;">
            <div class="card-header" style="margin-bottom: 0;">
              <div class="card-title">Threat Volume Trends</div>
              <div style="display: flex; gap: 8px; background: rgba(255,255,255,0.02); padding: 4px; border-radius: 8px; border: 1px solid var(--border);">
                <button class="pill" style="background: var(--surface-hover); color: var(--fg); border: 1px solid var(--border); cursor: pointer; padding: 4px 12px; text-transform: none; font-size: 12px;">1 Day</button>
                <button class="pill" style="background: transparent; color: var(--muted); border: 1px solid transparent; cursor: pointer; padding: 4px 12px; text-transform: none; font-size: 12px;">7 Days</button>
                <button class="pill" style="background: transparent; color: var(--muted); border: 1px solid transparent; cursor: pointer; padding: 4px 12px; text-transform: none; font-size: 12px;">30 Days</button>
                <button class="pill" style="background: transparent; color: var(--muted); border: 1px solid transparent; cursor: pointer; padding: 4px 12px; text-transform: none; font-size: 12px;">90 Days</button>
              </div>
            </div>
            <div style="height: 280px; position: relative; margin-top: 24px;">
               <!-- SVG Area chart -->
               <svg viewBox="0 0 1000 240" style="width: 100%; height: 100%; preserveAspectRatio: none;">
                 <defs>
                   <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#a855f7" stop-opacity="0.3" />
                     <stop offset="100%" stop-color="#a855f7" stop-opacity="0" />
                   </linearGradient>
                   <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stop-color="#10b981" stop-opacity="0.2" />
                     <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
                   </linearGradient>
                 </defs>
                 <!-- Grid lines -->
                 <path d="M0,40 L1000,40 M0,90 L1000,90 M0,140 L1000,140 M0,190 L1000,190" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4" fill="none" />
                 
                 <!-- Secondary Area (e.g. Blocked) -->
                 <path d="M0,180 C100,150 200,190 300,140 C400,160 500,130 600,150 C700,120 800,160 900,110 L1000,140 L1000,240 L0,240 Z" fill="url(#areaGrad2)" />
                 <path d="M0,180 C100,150 200,190 300,140 C400,160 500,130 600,150 C700,120 800,160 900,110 L1000,140" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

                 <!-- Primary Area (e.g. Total Threats) -->
                 <path d="M0,140 C100,120 200,160 300,90 C400,110 500,60 600,80 C700,40 800,90 900,30 L1000,60 L1000,240 L0,240 Z" fill="url(#areaGrad)" />
                 <path d="M0,140 C100,120 200,160 300,90 C400,110 500,60 600,80 C700,40 800,90 900,30 L1000,60" fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                 
                 <!-- Interactive point -->
                 <circle cx="900" cy="30" r="5" fill="#a855f7" stroke="#1a1a1c" stroke-width="2" />
                 <circle cx="900" cy="30" r="12" fill="none" stroke="rgba(168,85,247,0.4)" stroke-width="1" />
                 
                 <line x1="900" y1="30" x2="900" y2="240" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4 4" />
               </svg>
               <!-- Custom Tooltip -->
               <div style="position: absolute; right: 80px; top: 10px; background: var(--surface); border: 1px solid var(--border); padding: 12px; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); display: flex; flex-direction: column; gap: 8px; min-width: 140px;">
                 <div style="font-size: 11px; color: var(--muted); margin-bottom: 4px;">Oct 24, 14:00</div>
                 <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                   <div style="display: flex; align-items: center; gap: 6px;"><div style="width: 8px; height: 8px; border-radius: 50%; background: #a855f7;"></div>Total Threats</div>
                   <div style="font-family: var(--font-mono); font-weight: 500;">2,450</div>
                 </div>
                 <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                   <div style="display: flex; align-items: center; gap: 6px;"><div style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></div>Blocked</div>
                   <div style="font-family: var(--font-mono); font-weight: 500;">2,120</div>
                 </div>
               </div>
               
               <!-- x axis labels -->
               <div style="display: flex; justify-content: space-between; color: var(--muted); font-size: 11px; font-family: var(--font-mono); margin-top: 12px;">
                 <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>24:00</span>
               </div>
            </div>
          </div>
        </div>
"""

content = content.replace('<!-- 1. Top Core Metrics -->', area_chart_html + '\n        <!-- 1. Top Core Metrics -->')

# 3. Clean up old user profile in header since it's now in the sidebar
content = re.sub(r'<div class="user-profile">.*?</div>', '', content, flags=re.DOTALL)

with open('deepmail-dashboard.html', 'w') as f:
    f.write(content)
