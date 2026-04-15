"use client";

export default function AnalyticsPage() {
  return (
    <div>
      {/* Header */}
      <div className="analytics-header">
        <h2>The Extraction Data</h2>
        <p>Quarterly Performance Analysis &amp; Guest Sentiment Metrics</p>
      </div>

      {/* Stat Cards */}
      <div className="analytics-stats">
        <div className="analytics-stat-card">
          <div className="analytics-stat-header">
            <span className="analytics-stat-label">Total Revenue</span>
            <span className="analytics-stat-change positive">+12.4%</span>
          </div>
          <div className="analytics-stat-value">$142,850.00</div>
          <div className="analytics-stat-sub">v. previous 30 days</div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-header">
            <span className="analytics-stat-label">Conversion Rate</span>
            <span className="analytics-stat-change positive">+3.1%</span>
          </div>
          <div className="analytics-stat-value">18.2%</div>
          <div className="analytics-stat-sub">Visitor to Order ratio</div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-header">
            <span className="analytics-stat-label">Top Dish</span>
            <span className="analytics-stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
            </span>
          </div>
          <div className="analytics-stat-value" style={{ fontSize: "28px" }}>Baklava Pancakes</div>
          <div className="analytics-stat-sub highlight">High Velocity</div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-header">
            <span className="analytics-stat-label">Avg Order Value</span>
            <span className="analytics-stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            </span>
          </div>
          <div className="analytics-stat-value">$42.50</div>
          <div className="analytics-stat-sub">Premium segment growth</div>
        </div>
      </div>

      {/* Mid Grid: Chart + Donut */}
      <div className="analytics-mid-grid">
        {/* Engagement Chart */}
        <div className="chart-section">
          <div className="chart-header">
            <div>
              <h3>The Daily Grind</h3>
              <p>Hourly engagement &amp; foot traffic frequency</p>
            </div>
            <div className="chart-toggle">
              <button className="active">Weekly</button>
              <button>Monthly</button>
            </div>
          </div>

          <div className="stacked-bar-chart">
            {[
              { label: "MON", segments: [35, 25, 15] },
              { label: "TUE", segments: [30, 20, 25] },
              { label: "WED", segments: [40, 30, 15] },
              { label: "THU", segments: [45, 25, 20] },
              { label: "FRI", segments: [50, 30, 25] },
              { label: "SAT", segments: [55, 25, 20] },
              { label: "SUN", segments: [35, 20, 15] },
            ].map((day) => (
              <div className="stacked-bar-col" key={day.label}>
                <div className="stacked-bar-segments">
                  <div className="stacked-bar-segment dark" style={{ height: `${day.segments[0]}px` }} />
                  <div className="stacked-bar-segment medium" style={{ height: `${day.segments[1]}px` }} />
                  <div className="stacked-bar-segment light" style={{ height: `${day.segments[2]}px` }} />
                </div>
                <span className="stacked-bar-label">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Donut */}
        <div className="donut-section">
          <h3>Sentiment Analysis</h3>
          <p>Guest feedback distribution</p>

          <div className="donut-wrapper">
            <div className="donut-chart">
              <svg width="180" height="180" viewBox="0 0 180 180">
                {/* Background circle */}
                <circle cx="90" cy="90" r="70" fill="none" stroke="#e8e0d0" strokeWidth="24" />
                {/* Green - 65% */}
                <circle cx="90" cy="90" r="70" fill="none" stroke="#4caf50" strokeWidth="24"
                  strokeDasharray={`${65 * 4.4} ${100 * 4.4}`}
                  strokeDashoffset="0" strokeLinecap="round" />
                {/* Orange - 19% */}
                <circle cx="90" cy="90" r="70" fill="none" stroke="#c8924a" strokeWidth="24"
                  strokeDasharray={`${19 * 4.4} ${100 * 4.4}`}
                  strokeDashoffset={`${-65 * 4.4}`} strokeLinecap="round" />
                {/* Gray - 16% */}
                <circle cx="90" cy="90" r="70" fill="none" stroke="#bdb5a5" strokeWidth="24"
                  strokeDasharray={`${16 * 4.4} ${100 * 4.4}`}
                  strokeDashoffset={`${-(65 + 19) * 4.4}`} strokeLinecap="round" />
              </svg>
              <div className="donut-center">
                <span className="donut-value">84%</span>
                <span className="donut-label">Positive</span>
              </div>
            </div>

            <div className="donut-legend">
              <div className="donut-legend-item">
                <span className="donut-legend-dot green" />
                <span className="donut-legend-text">Delightful Experience</span>
                <span className="donut-legend-value">65%</span>
              </div>
              <div className="donut-legend-item">
                <span className="donut-legend-dot orange" />
                <span className="donut-legend-text">Quality of Service</span>
                <span className="donut-legend-value">19%</span>
              </div>
              <div className="donut-legend-item">
                <span className="donut-legend-dot gray" />
                <span className="donut-legend-text">Neutral / Others</span>
                <span className="donut-legend-value">16%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Peak Hours + Top Items */}
      <div className="analytics-bottom-grid">
        {/* Peak Hours */}
        <div className="peak-hours-section">
          <h3>Peak Hours</h3>
          <p>Visualized throughput density</p>

          <div className="heatmap">
            <div className="heatmap-row">
              <span className="heatmap-label">08:00</span>
              <div className="heatmap-cells">
                <div className="heatmap-cell level-1" />
                <div className="heatmap-cell level-2" />
                <div className="heatmap-cell level-1" />
                <div className="heatmap-cell level-3" />
                <div className="heatmap-cell level-2" />
              </div>
            </div>
            <div className="heatmap-row">
              <span className="heatmap-label">12:00</span>
              <div className="heatmap-cells">
                <div className="heatmap-cell level-3" />
                <div className="heatmap-cell level-4" />
                <div className="heatmap-cell level-4" />
                <div className="heatmap-cell level-3" />
                <div className="heatmap-cell level-4" />
              </div>
            </div>
            <div className="heatmap-row">
              <span className="heatmap-label">16:00</span>
              <div className="heatmap-cells">
                <div className="heatmap-cell level-2" />
                <div className="heatmap-cell level-3" />
                <div className="heatmap-cell level-4" />
                <div className="heatmap-cell level-2" />
                <div className="heatmap-cell level-3" />
              </div>
            </div>
            <div className="heatmap-row">
              <span className="heatmap-label">20:00</span>
              <div className="heatmap-cells">
                <div className="heatmap-cell level-1" />
                <div className="heatmap-cell level-3" />
                <div className="heatmap-cell level-2" />
                <div className="heatmap-cell level-4" />
                <div className="heatmap-cell level-1" />
              </div>
            </div>
          </div>

          <div className="peak-quote">
            &ldquo;Peak throughput occurs between 12:45 and 13:30 daily.&rdquo;
          </div>
        </div>

        {/* Top Performing Items */}
        <div className="top-items-section">
          <div className="top-items-header">
            <h3>Top Performing Items</h3>
            <button>•••</button>
          </div>
          <p className="top-items-sub">Revenue generation by product category</p>

          <table className="top-items-table">
            <thead>
              <tr>
                <th>Dish Name</th>
                <th>Category</th>
                <th>Revenue</th>
                <th>Growth %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="item-name">Baklava Pancakes</td>
                <td><span className="category-badge breakfast">Breakfast</span></td>
                <td className="item-revenue">$12,450</td>
                <td className="item-growth positive">+24%</td>
              </tr>
              <tr>
                <td className="item-name">Cold Brew Crema</td>
                <td><span className="category-badge coffee">Coffee</span></td>
                <td className="item-revenue">$8,120</td>
                <td className="item-growth positive">+18%</td>
              </tr>
              <tr>
                <td className="item-name">Avocado Tartine</td>
                <td><span className="category-badge brunch">Brunch</span></td>
                <td className="item-revenue">$7,600</td>
                <td className="item-growth negative">-2%</td>
              </tr>
              <tr>
                <td className="item-name">Truffle Scramble</td>
                <td><span className="category-badge breakfast">Breakfast</span></td>
                <td className="item-revenue">$5,920</td>
                <td className="item-growth positive">+12%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* New Report Button */}
      <button className="new-report-btn">New Report</button>
    </div>
  );
}
