# Smart Water Management Dashboard

A responsive, multilingual IoT dashboard for real-time water quality monitoring built with React, Vite, Tailwind CSS, and ECharts.

## Features

### 🌊 Real-time Water Quality Monitoring
- **TDS (Total Dissolved Solids)** monitoring with ppm values
- **Temperature** tracking in Celsius
- **Turbidity** measurement in NTU units
- **pH Level** monitoring with status indicators

### 📊 Advanced Data Visualization
- Real-time line charts for each parameter
- Radar chart for water quality overview
- Historical trend analysis
- Color-coded status indicators
- Interactive tooltips and legends

### 🌍 Multilingual Support
- **English** - Default language
- **Hindi** - हिंदी भाषा समर्थन
- **Telugu** - తెలుగు భాష మద్దతు
- Easy language switching in header

### 🎨 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Modern UI with Tailwind CSS
- Dark/light mode ready
- Smooth animations and transitions

### 🔔 Smart Alert System
- Real-time alerts for parameter violations
- Color-coded severity levels (Excellent, Good, Warning, Danger)
- Detailed alert messages with timestamps
- Parameter-specific thresholds

### 🔥 Real-time Data Connection
- Firebase Realtime Database integration
- Live data updates without page refresh
- Automatic reconnection handling
- Manual refresh capability

## Water Quality Standards

### TDS (Total Dissolved Solids)
- **Excellent**: < 300 ppm
- **Good**: 300-600 ppm
- **Warning**: 600-900 ppm
- **Danger**: > 900 ppm

### pH Level
- **Excellent**: 6.5-8.5
- **Good**: 6.0-9.0
- **Warning**: 5.5-6.0 or 9.0-9.5
- **Danger**: < 5.5 or > 9.5

### Turbidity
- **Excellent**: < 1 NTU
- **Good**: 1-4 NTU
- **Warning**: 4-10 NTU
- **Danger**: > 10 NTU

### Temperature
- **Excellent**: 20-25°C
- **Good**: 15-30°C
- **Warning**: 10-15°C or 30-35°C
- **Danger**: < 10°C or > 35°C

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS 3
- **Charts**: ECharts for React
- **Database**: Firebase Realtime Database
- **Internationalization**: react-i18next
- **Icons**: Lucide React
- **Language**: JavaScript/JSX

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-water-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
smart-water-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard component
│   │   ├── Header.jsx             # Header with language switcher
│   │   ├── MetricCard.jsx         # Individual metric display
│   │   ├── RealTimeChart.jsx      # ECharts line charts
│   │   ├── WaterQualityOverview.jsx # Radar chart
│   │   └── AlertsPanel.jsx        # Alert system
│   ├── i18n/
│   │   ├── i18n.js               # i18next configuration
│   │   └── locales/
│   │       ├── en.json           # English translations
│   │       ├── hi.json           # Hindi translations
│   │       └── te.json           # Telugu translations
│   ├── services/
│   │   └── firebase.js           # Firebase service layer
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles with Tailwind
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Firebase Configuration

The dashboard connects to Firebase Realtime Database at:
```
https://smartwatersystem-74f77-default-rtdb.asia-southeast1.firebasedatabase.app/
```

Expected data structure:
```json
{
  "sensorData": {
    "TDS": 127,
    "Temperature": 25.5,
    "Turbidity": 1.2,
    "pH": 7.1
  }
}
```

## Key Components

### Dashboard.jsx
- Main container component
- Manages real-time data flow
- Coordinates all child components
- Handles loading states and errors

### Header.jsx
- Language switcher
- Refresh functionality
- Last updated timestamp
- Responsive navigation

### MetricCard.jsx
- Individual parameter display
- Status indicators
- Trend visualization
- Responsive design

### RealTimeChart.jsx
- ECharts line chart implementation
- Real-time data updates
- Custom styling and animations
- Interactive tooltips

### WaterQualityOverview.jsx
- Radar chart for all parameters
- Normalized value display
- Interactive legend
- Parameter correlation view

### AlertsPanel.jsx
- Real-time alert generation
- Priority-based display
- Timestamp tracking
- Status-based styling

## Customization

### Adding New Languages
1. Create new translation file in `src/i18n/locales/`
2. Update language options in `Header.jsx`
3. Import new translations in `i18n.js`

### Modifying Water Quality Standards
Update the ranges in `services/firebase.js` in the `getParameterStatus` method.

### Adding New Parameters
1. Update Firebase service
2. Add translations
3. Create new metric cards
4. Update chart configurations

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables
No environment variables required for basic setup. The Firebase database URL is configured directly in the service file.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Android Chrome)
- Responsive design for all screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please create an issue in the repository.

---

Built with ❤️ for smart water management systems
