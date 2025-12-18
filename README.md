# Analytics Dashboard

A full-stack analytics dashboard for visualizing AI Note-Taking Pin sales data. Built with React (frontend) and Flask (backend).

![Dashboard Preview](docs/dashboard-preview.png)

## Features

- **KPI Cards** - Total revenue, transactions, units sold, and averages
- **Interactive Charts** - Revenue by region, sales channel breakdown, daily/monthly trends
- **Data Table** - Sortable, paginated view of all transactions
- **Filters** - Filter by date range, region, channel, and price
- **File Upload** - Upload new CSV data files to update the dashboard

## Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/promptadvisers/claude-code-analytics.git
cd claude-code-analytics
```

### 2. Set up the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

The backend will start at **http://localhost:5001**

### 3. Set up the Frontend (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend will start at **http://localhost:3000**

### 4. Open the Dashboard

Navigate to **http://localhost:3000** in your browser.

## Project Structure

```
claude-code-analytics/
├── backend/
│   ├── app.py              # Flask API server
│   ├── data_processor.py   # Data processing logic
│   ├── requirements.txt    # Python dependencies
│   └── data/               # Backup files directory
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main application component
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript type definitions
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
├── data/
│   └── AI_Note_Taking_Pin_Sales_Data__2025_.csv  # Sample dataset
└── README.md
```

## Data Format

The dashboard expects a CSV file with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `Sale_ID` | Integer | Unique identifier for each sale |
| `Date` | String (YYYY-MM-DD) | Date of the transaction |
| `Region` | String | Geographic region (e.g., "North America", "Europe") |
| `Sales_Channel` | String | Channel of sale (e.g., "Direct Sales", "Online Store") |
| `Units_Sold` | Integer | Number of units sold |
| `Price_Per_Unit` | Float | Price per unit in USD |
| `Revenue` | Float | Total revenue (Units_Sold × Price_Per_Unit) |

### Sample Data

```csv
Sale_ID,Date,Region,Sales_Channel,Units_Sold,Price_Per_Unit,Revenue
1,2025-01-15,North America,Direct Sales,10,199.00,1990.00
2,2025-01-16,Europe,Online Store,5,179.00,895.00
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/kpi` | GET | Key performance indicators |
| `/api/revenue-by-region` | GET | Revenue breakdown by region |
| `/api/revenue-by-channel` | GET | Revenue breakdown by sales channel |
| `/api/daily-trends` | GET | Daily revenue trends |
| `/api/monthly-trends` | GET | Monthly revenue trends |
| `/api/price-distribution` | GET | Price distribution data |
| `/api/filter-options` | GET | Available filter options |
| `/api/data` | GET | Paginated transaction data |
| `/api/analytics/filtered` | POST | Filtered analytics data |
| `/api/upload` | POST | Upload new CSV file |

## Configuration

### Backend

- **Port**: 5001 (configured in `app.py`)
- **Data File**: `data/AI_Note_Taking_Pin_Sales_Data__2025_.csv`
- **Max Upload Size**: 16MB

### Frontend

- **Port**: 3000 (default React development server)
- **API Proxy**: Configured in `package.json` to proxy `/api` requests to backend

## Troubleshooting

### Backend won't start - "Port 5001 is in use"

```bash
# Find and kill the process using port 5001
lsof -ti:5001 | xargs kill -9
```

### Frontend can't connect to backend

1. Ensure the backend is running on port 5001
2. Check that CORS is enabled (it is by default)
3. Try hard-refreshing the browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Data not loading

1. Verify the CSV file exists at `data/AI_Note_Taking_Pin_Sales_Data__2025_.csv`
2. Check the backend console for error messages
3. Open browser DevTools (F12) and check the Console/Network tabs for errors

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Recharts (charting library)
- Axios (HTTP client)

**Backend:**
- Flask
- Flask-CORS
- Pandas (data processing)
- Werkzeug (file uploads)

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
