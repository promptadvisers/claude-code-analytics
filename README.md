<p align="center">
  <h1 align="center">Analytics Dashboard</h1>
  <p align="center">
    A full-stack analytics dashboard for visualizing AI Note-Taking Pin sales data
    <br />
    <strong>React + Flask + Polars</strong>
  </p>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-data-format">Data Format</a> •
  <a href="#-troubleshooting">Troubleshooting</a>
</p>

---

## Features

| Feature | Description |
|---------|-------------|
| **KPI Dashboard** | Real-time metrics for revenue, transactions, units sold, and averages |
| **Interactive Charts** | Revenue by region, sales channel breakdown, daily/monthly trends |
| **Data Table** | Sortable, paginated view with search and export capabilities |
| **Advanced Filters** | Filter by date range, region, channel, and price range |
| **File Upload** | Drag-and-drop CSV upload with automatic data validation |
| **Responsive Design** | Works seamlessly on desktop, tablet, and mobile |

---

## Quick Start

### Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | v16+ | `node --version` |
| Python | v3.8+ | `python --version` |
| npm | v8+ | `npm --version` |

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/promptadvisers/claude-code-analytics.git
cd claude-code-analytics
```

**2. Backend Setup**

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

> Backend runs at `http://localhost:5001`

**3. Frontend Setup** (new terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

> Frontend runs at `http://localhost:3000`

**4. Open your browser**

Navigate to **http://localhost:3000** — the dashboard will load automatically.

---

## Project Structure

```
claude-code-analytics/
│
├── backend/
│   ├── app.py                 # Flask API server (routes & endpoints)
│   ├── data_processor.py      # Data processing with Polars
│   ├── requirements.txt       # Python dependencies
│   └── data/                  # Auto-generated backup files
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main React component
│   │   ├── components/
│   │   │   ├── KPICards.tsx   # KPI metric cards
│   │   │   ├── Charts.tsx     # Recharts visualizations
│   │   │   ├── DataTable.tsx  # Paginated data table
│   │   │   └── FileUpload.tsx # CSV upload component
│   │   ├── services/
│   │   │   └── api.ts         # Axios API client
│   │   └── types/
│   │       └── index.ts       # TypeScript interfaces
│   ├── package.json
│   └── tailwind.config.js
│
├── data/
│   └── AI_Note_Taking_Pin_Sales_Data__2025_.csv   # Sample dataset
│
└── README.md
```

---

## Data Format

The dashboard expects CSV files with the following schema:

| Column | Type | Example | Description |
|--------|------|---------|-------------|
| `Sale_ID` | Integer | `1` | Unique transaction identifier |
| `Date` | Date | `2025-04-25` | Transaction date (YYYY-MM-DD) |
| `Units_Sold` | Integer | `5` | Number of units in transaction |
| `Price_Per_Unit` | Float | `149.00` | Unit price in USD |
| `Revenue` | Float | `745.00` | Total revenue (auto-calculated) |
| `Region` | String | `North America` | Geographic region |
| `Sales_Channel` | String | `Online Store` | Sales channel type |

### Sample Data

```csv
Sale_ID,Date,Units_Sold,Price_Per_Unit,Revenue,Region,Sales_Channel
1,2025-11-24,4,149,596,Asia,Retail Partner
2,2025-04-25,5,149,745,Africa,Online Store
3,2025-10-30,14,149,2086,North America,Online Store
4,2025-04-22,8,149,1192,Africa,Retail Partner
```

### Supported Regions

`North America` • `South America` • `Europe` • `Asia` • `Africa`

### Supported Sales Channels

`Direct Sales` • `Online Store` • `Retail Partner` • `Event Booth`

---

## API Reference

Base URL: `http://localhost:5001/api`

### Health & Status

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |

### Analytics Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/kpi` | GET | Key performance indicators (revenue, units, averages) |
| `/revenue-by-region` | GET | Revenue aggregated by geographic region |
| `/revenue-by-channel` | GET | Revenue aggregated by sales channel |
| `/daily-trends` | GET | Daily revenue and transaction trends |
| `/monthly-trends` | GET | Monthly aggregated trends |
| `/price-distribution` | GET | Price point distribution analysis |
| `/filter-options` | GET | Available filter values (regions, channels, date range) |

### Data Endpoints

| Endpoint | Method | Parameters | Description |
|----------|--------|------------|-------------|
| `/data` | GET | `page`, `per_page`, `sort_by`, `sort_order`, filters | Paginated transaction data |
| `/analytics/filtered` | POST | JSON body with filter criteria | Filtered analytics data |
| `/upload` | POST | `multipart/form-data` | Upload new CSV file |

### Example: Get Paginated Data

```bash
curl "http://localhost:5001/api/data?page=1&per_page=10&sort_by=Date&sort_order=desc"
```

### Example: Upload New Data

```bash
curl -X POST -F "file=@sales_data.csv" http://localhost:5001/api/upload
```

---

## Configuration

### Backend Configuration

| Setting | Value | Location |
|---------|-------|----------|
| Port | `5001` | `backend/app.py` |
| Data File | `data/AI_Note_Taking_Pin_Sales_Data__2025_.csv` | `backend/app.py` |
| Max Upload Size | 16 MB | `backend/app.py` |
| CORS | Enabled (all origins) | `backend/app.py` |

### Frontend Configuration

| Setting | Value | Location |
|---------|-------|----------|
| Port | `3000` | Default React |
| API Proxy | `http://localhost:5001` | `frontend/package.json` |
| Request Timeout | 10 seconds | `frontend/src/services/api.ts` |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Recharts | Data visualization |
| Axios | HTTP client |
| Headless UI | Accessible components |

### Backend

| Technology | Purpose |
|------------|---------|
| Flask 3.0 | Web framework |
| Flask-CORS | Cross-origin requests |
| Polars | High-performance data processing |
| Watchdog | File system monitoring |

---

## Troubleshooting

### Port 5001 Already in Use

```bash
# Find and kill the process
lsof -ti:5001 | xargs kill -9

# Then restart the backend
python app.py
```

### Port 3000 Already in Use

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Then restart the frontend
npm start
```

### Frontend Can't Connect to Backend

1. Verify backend is running: `curl http://localhost:5001/api/health`
2. Check browser console for CORS errors
3. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### Data Not Loading

1. Verify the CSV file exists:
   ```bash
   ls -la data/AI_Note_Taking_Pin_Sales_Data__2025_.csv
   ```
2. Check backend console for errors
3. Test the API directly:
   ```bash
   curl http://localhost:5001/api/kpi
   ```

### CSV Upload Fails

- Ensure file is valid CSV format
- Check file size (max 16 MB)
- Verify column names match expected schema
- Check backend console for detailed error messages

---

## Development

### Running Tests

```bash
# Frontend tests
cd frontend && npm test

# Backend (if tests exist)
cd backend && python -m pytest
```

### Building for Production

```bash
# Frontend build
cd frontend && npm run build

# The build output will be in frontend/build/
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with React, Flask, and Polars
</p>
