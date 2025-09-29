# Time Tracker React Native App

A beautiful and functional time tracking mobile application built with React Native and Expo, converted from Stitch design files.

## Features

- ⏱️ **Timer Functionality**: Start/stop timer with real-time tracking
- 📊 **Activity Heatmap**: Visual representation of work patterns
- 📱 **Multiple Screens**: Login, Home, History, Customization, and Reports
- 🎨 **Customizable Design**: Timer styles, color themes, and fonts
- 📈 **Work History**: Track and view past work sessions
- 🌙 **Dark Mode Ready**: Theme system prepared for light/dark modes
- 📱 **Bottom Tab Navigation**: Intuitive navigation between screens

## Screens

1. **Login Screen**: Authentication with social login options
2. **Home Screen**: Main timer interface with activity heatmap
3. **History Screen**: View past work sessions organized by day
4. **Customization Screen**: Personalize timer appearance and settings
5. **Reports Screen**: Weekly statistics and productivity insights

## Tech Stack

- **React Native** with Expo
- **React Navigation** for screen navigation
- **Expo Vector Icons** for consistent iconography
- **Custom Theme System** for consistent styling
- **TypeScript Ready** (can be easily converted)

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Install Expo CLI** (if not already installed):
   ```bash
   npm install -g expo-cli
   ```

3. **Start the Development Server**:
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on Device/Simulator**:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press `i` for iOS simulator, `a` for Android emulator

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.js       # Custom button component
│   ├── Header.js       # Header component with navigation
│   └── ActivityHeatmap.js # Heatmap visualization
├── screens/            # Screen components
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── HistoryScreen.js
│   ├── CustomizationScreen.js
│   └── ReportsScreen.js
├── navigation/         # Navigation configuration
│   └── MainTabNavigator.js
└── styles/            # Theme and styling
    └── theme.js       # Color palette, fonts, spacing
```

## Customization

### Theme System
The app uses a centralized theme system located in `src/styles/theme.js`. You can easily customize:

- **Colors**: Primary colors, backgrounds, text colors
- **Typography**: Font families, sizes, weights
- **Spacing**: Consistent spacing scale
- **Border Radius**: Rounded corners
- **Shadows**: Elevation and shadow effects

### Adding New Features

1. **New Screen**: Create in `src/screens/` and add to navigation
2. **New Component**: Add to `src/components/` and import where needed
3. **Styling**: Use the theme system for consistent design

## Font Setup

The app uses Inter font family. To add the fonts:

1. Download Inter fonts from Google Fonts
2. Place font files in `assets/fonts/` directory:
   - `Inter-Regular.ttf`
   - `Inter-Medium.ttf`
   - `Inter-Bold.ttf`

## Future Enhancements

- [ ] **Data Persistence**: AsyncStorage or SQLite integration
- [ ] **Push Notifications**: Timer reminders and break notifications
- [ ] **Export Features**: Export time data to CSV/PDF
- [ ] **Goal Setting**: Daily/weekly time goals
- [ ] **Categories**: Project/task categorization
- [ ] **Analytics**: Advanced productivity analytics
- [ ] **Sync**: Cloud synchronization across devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.
