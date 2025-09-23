# Sparta Public Transport Tracking - Design Guidelines

## Design Approach
**Reference-Based Approach**: Following Apple's iOS design language with a specialized transport-focused dark interface. This utility-focused application prioritizes clarity and efficiency for real-time information consumption.

## Core Design Elements

### A. Color Palette
- **Primary Background**: Pure black (#000000 / 0 0% 0%)
- **Text Primary**: Orange (#FF8C00 / 30 100% 50%)
- **Text Secondary**: Light gray for supporting information (0 0% 70%)
- **Accent**: Subtle orange variations for interactive states (30 90% 45%)
- **Success/Active**: Bright green for live tracking status (120 100% 40%)
- **Warning**: Amber for delays or alerts (45 100% 50%)

### B. Typography
- **Primary Font**: SF Pro Display (Apple iOS system font)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- **Hierarchy**: Bold headings, regular body text, medium weight for emphasis
- **Orange text throughout** following user specification

### C. Layout System
- **Spacing Units**: Tailwind spacing of 2, 4, 6, and 8 (p-2, m-4, gap-6, h-8)
- **Grid**: 12-column responsive grid with generous gutters
- **Container**: Max-width container with side padding on mobile

### D. Component Library

#### Navigation
- Clean top navigation with "Sparta" logo in orange
- Minimal navigation items focusing on core functionality

#### Route Selection Interface
- Large, prominent source/destination dropdowns using ShadCN Select components
- Dropdowns include main locations (Patiala, Chandigarh, Mohali) and sub-locations:
  - **Bus stops**: "Central Bus Stand", "Railway Station Stop", "Mall Road Stop"
  - **Landmarks**: "Clock Tower", "University Gate", "Hospital Junction"
  - **Neighborhoods**: "Model Town", "Urban Estate", "Sector 17"
- Orange text on black backgrounds for all form elements

#### Bus Schedule Display
- Card-based layout showing:
  - Route name in bold orange
  - Bus type (Ordinary/Deluxe) with appropriate badges
  - Starting and ending times prominently displayed
  - Available departure times in a clean list format

#### Live Map Integration
- Full-width map container with Google Maps
- Custom orange markers for bus positions
- Route overlays in orange with transparency
- ETA display overlay with semi-transparent black background

#### Interactive Elements
- ShadCN components styled with orange accents
- Buttons with orange backgrounds and black text for primary actions
- Subtle hover states maintaining the orange/black theme
- Loading states for real-time data fetching

### E. Animations
- Minimal, purposeful animations only:
  - Smooth transitions for dropdown selections
  - Gentle pulse for live bus markers on map
  - Loading spinners in orange

## Specific Implementation Notes
- Maintain black background throughout entire application
- All text in orange unless specifically noted for secondary information
- Use ShadCN components but override styling to match orange/black theme
- Ensure high contrast ratios for accessibility
- Mobile-first responsive design with touch-friendly targets
- Real-time data updates without jarring interface changes

## User Experience Flow
1. **Landing**: Route selection prominently displayed
2. **Selection**: Intuitive dropdown flow with sub-location filtering
3. **Results**: Clear schedule presentation with booking/tracking options
4. **Live View**: Map-centric interface with ETA and position data
5. **Status**: Real-time updates with clear visual indicators

This design prioritizes functionality and real-time information display while maintaining the requested aesthetic of black backgrounds with orange text throughout.