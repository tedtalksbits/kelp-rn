# Copilot Instructions - Kelp Fitness App

## Project Overview

Kelp is a React Native fitness tracking application built with Expo Router and Supabase. This app allows users to track workouts, manage profiles, and execute workout sessions with real-time timers and exercise logging.

## Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (PostgreSQL database with real-time capabilities)
- **State Management**: React Query (TanStack Query)
- **UI Components**: Custom component library with consistent design system
- **Image Handling**: expo-image with caching
- **Gradients**: expo-linear-gradient
- **Icons**: lucide-react-native

## Project Structure

```
src/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Auth flow (sign-in, sign-up)
│   ├── (home)/                   # Home screen
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── index.tsx             # Home tab
│   │   ├── profile/              # Profile management
│   │   └── workouts/             # Workout library
│   └── workout/
│       └── [sessionId].tsx       # Active workout session screen
├── components/                   # Reusable UI components
├── contexts/                     # React contexts (theme, etc.)
├── features/                     # Feature-based modules
│   ├── onboarding/              # User onboarding wizard
│   │   ├── components/
│   │   │   ├── steps/           # Individual step components
│   │   │   └── onboarding-wizard.tsx
│   │   ├── hooks/
│   │   │   └── use-onboarding.ts
│   │   └── types/
│   │       └── onboarding.types.ts
│   ├── user-profile/            # Profile management
│   └── workouts/                # Workout features
├── hooks/                        # Custom React hooks
├── libs/                         # Utilities and third-party configs
│   ├── utils.ts                 # General utilities
│   ├── utils/
│   │   └── gradient-parser.ts   # CSS gradient to RN parser
│   ├── react-query/             # React Query config
│   └── supabase/                # Supabase client & types
└── providers/                    # Context providers
```

## Key Features & Patterns

### 1. Onboarding Wizard

**Location**: `src/features/onboarding/`

**Architecture**:

- Modular step-based system - easy to add/remove steps
- Each step is a separate component with single responsibility
- Centralized state management via `useOnboarding` hook
- Progress indicator and validation per step

**Steps** (8 total):

1. **Name**: Text input for user's name
2. **Fitness Level**: Selection (beginner/intermediate/advanced)
3. **Goals & Target Areas**: Multi-select chips for goals and body areas
4. **Equipment**: Multi-select equipment availability
5. **Physical Stats**: Age, weight, height selectors
6. **Schedule**: Workout days + preferred time
7. **Limitations**: Physical limitation selection (optional)
8. **Notifications**: Push notification permission request

**Data Flow**:

```typescript
// Entry Point (src/app/index.tsx)
const { data: profile } = useProfile();
if (!profile) {
  return <OnboardingWizard />;
}

// Wizard manages state through all steps
const { data, updateData } = useOnboarding();

// Final submission creates profile
createProfile({
  user_id,
  name: data.name,
  fitness_level: data.fitnessLevel,
  goals: data.goals,
  // ... all collected data
});
```

**Step Configuration**:

```typescript
interface OnboardingStep {
  id: string;
  title: string;
  component: React.ComponentType;
  isValid: (data) => boolean;
  canSkip?: boolean;
}
```

**Key Patterns**:

- Use BottomSheet for selectors (age, weight, height, time)
- Multi-select chips for goals, equipment, limitations
- Automatic device timezone detection
- Validation before allowing next step
- expo-notifications for push permission

### 2. Workout Session Flow

**Location**: `src/app/workout/[sessionId].tsx`

**State Machine**:

- `get-ready`: 5-second countdown before starting
- `exercise`: Active exercise with timer, image, DONE button
- `rest`: 60-second rest with next exercise preview
- `summary`: Review screen to adjust sets/reps, add difficulty rating and notes
- `completed`: Success screen

**Timer Management**:

- Uses two separate `useEffect` hooks:
  1. Timer initialization based on state changes
  2. Interval management for countdown/count-up logic
- `useRef` to store interval reference
- Timer counts UP during exercise state, DOWN during get-ready/rest states

**Data Flow**:

```typescript
// When user clicks DONE on an exercise:
1. Update exercise log with completed: true, duration, planned sets/reps
2. Initialize adjustment state with planned values
3. Navigate to rest OR summary (if last exercise)

// In summary state:
1. User can adjust actual sets/reps completed per exercise
2. User rates perceived difficulty (1-5 scale)
3. User can add optional notes
4. On "Complete Workout":
   - Apply all exercise adjustments via batch updates
   - Complete session with duration, difficulty, notes
   - Navigate to completed state
```

### 2. Workout Library

**Location**: `src/app/(tabs)/workouts/index.tsx`

**Features**:

- Filter tabs: User templates, Favorites, Kelp (system) templates
- Workout cards with gradient backgrounds
- BottomSheet with exercise details
- Start workout → creates session → navigates to workout screen

**Gradient Handling**:

- Database stores CSS gradients: `"linear-gradient(to bottom right, #ef4444, #7f1d1d)"`
- `gradient-parser.ts` converts to React Native LinearGradient props
- Functions: `parseGradientColors()`, `parseGradientDirection()`

### 3. Profile Management

**Location**: `src/app/(tabs)/profile/index.tsx`

**Features**:

- Avatar upload with camera/library options
- Profile stats (workouts, streak, badges)
- Weekly schedule grid
- Preferred tags
- Edit profile via full-screen Modal

**Avatar Upload Strategy**:

- Uses Option A: Directory cleanup before upload
- Converts base64 to ArrayBuffer for Supabase compatibility
- Uses expo-image with `cachePolicy='none'`
- Cache-busting with timestamp query parameter
- Uploads to `profiles/[userId]/profile-pic-[timestamp].jpg`

**Selector Sheets**:
All selector components follow this pattern:

```typescript
// Files: age-selector-sheet, height-selector-sheet, weight-selector-sheet, gym-equipment-selector-sheet
- BottomSheet with scrollable options
- Surface components for each item
- onChange callback: (value, close) => void
- Ref callbacks must be void functions (no return values)
```

### 4. Component Patterns

**Screen Components**:

```tsx
import ScreenView from '@/components/screen-view';

<ScreenView className='bg-background'>{/* Screen content */}</ScreenView>;
```

**Bottom Sheets**:

```tsx
import { BottomSheet } from '@/components/bottom-sheet';

<BottomSheet open={isOpen} onOpenChange={setIsOpen}>
  <BottomSheet.Content>{/* Sheet content */}</BottomSheet.Content>
</BottomSheet>;
```

**Buttons**:

```tsx
import { Button } from '@/components/button';

<Button size='lg' variant='default' onPress={handlePress}>
  <Text>Button Text</Text>
</Button>;
```

**Surfaces**:

```tsx
import { Surface } from '@/components/surface';

<Surface className='p-4 rounded-lg'>{/* Card-like content */}</Surface>;
```

### 5. Styling Conventions

- Use NativeWind className prop for styling
- Common classes:
  - Backgrounds: `bg-background`, `bg-surface`, `bg-primary`
  - Text: `text-foreground`, `text-muted-foreground`, `text-primary-foreground`
  - Spacing: `gap-4`, `p-4`, `px-6`, `mb-8`
  - Layout: `flex flex-row`, `items-center`, `justify-between`
  - Sizing: `w-full`, `h-24`, `min-h-24`
  - Borders: `rounded-lg`, `rounded-full`, `border-2`

- Utility function for conditional classes:

```typescript
import { cn } from '@/libs/utils';

<View className={cn(
  'base-classes',
  condition && 'conditional-classes'
)} />
```

### 6. Supabase Integration

**Hooks Pattern**:

```typescript
// Query hooks
const { data, isLoading } = useWorkoutSession(sessionId);
const { data: templates } = useSystemTemplates();

// Mutation hooks
const { mutate: updateProfile } = useUpdateProfile();
const { mutate: completeSession } = useCompleteWorkoutSession();

// Usage
updateProfile(
  {
    userId,
    updates: { name: 'New Name' },
  },
  {
    onSuccess: () => {
      // Handle success
    },
  }
);
```

**Database Schema Notes**:

- `workout_sessions`: id, user_id, template_id, started_at, completed_at, duration_minutes, perceived_difficulty, user_notes
- `exercise_logs`: id, session_id, exercise_id, order_index, completed, duration_seconds, sets_completed, reps_completed, sets_planned, reps_planned
- `workout_templates`: id, name, description, gradient, is_system, user_id
- `profiles`: id, user_id, name, avatar_url, age, height_cm, weight_kg, gym_equipment, preferred_tags

**Storage**:

- Bucket: `avatars`
- Path structure: `profiles/[userId]/profile-pic-[timestamp].jpg`
- RLS policies required for avatar access

### 7. Navigation

**Expo Router Structure**:

- `/(tabs)`: Bottom tab navigation (Home, Workouts, Profile)
- `/(auth)`: Authentication flow
- `/workout/[sessionId]`: Dynamic route for workout sessions

**Common Navigation Patterns**:

```typescript
import { router } from 'expo-router';

// Navigate to a route
router.push('/(tabs)/workouts');

// Navigate with params
router.push(`/workout/${sessionId}`);

// Go back
router.back();
```

### 8. TypeScript Patterns

**Ref Callbacks**:

```typescript
// ✅ Correct - void function
ref={(ref) => { selectedRefs.current[key] = ref; }}

// ❌ Incorrect - returns value
ref={(ref) => (selectedRefs.current[key] = ref)}
```

**State Types**:

```typescript
type WorkoutState = 'get-ready' | 'exercise' | 'rest' | 'summary' | 'completed';

const [workoutState, setWorkoutState] = useState<WorkoutState>('get-ready');
```

**Record Types for Adjustments**:

```typescript
const [exerciseAdjustments, setExerciseAdjustments] = useState<
  Record<string, { sets: number; reps: number }>
>({});
```

## Common Issues & Solutions

### 1. Timer Not Working

- Ensure two separate useEffects: one for initialization, one for interval
- Clear intervals in cleanup function
- Don't run timer in 'completed' or 'summary' states

### 2. Avatar Upload Issues

- Use `base64ToArrayBuffer` conversion for Supabase
- Clean up directory before upload to avoid 0-byte files
- Use expo-image with `cachePolicy='none'` for immediate updates
- Add cache-busting timestamp to avatar URLs

### 3. Ref Callback Errors

- TypeScript expects void functions for ref callbacks
- Wrap assignments in curly braces: `ref={(ref) => { assignment }}`

### 4. Gradient Rendering

- Database stores CSS gradient strings
- Use `gradient-parser.ts` utility to convert to React Native format
- LinearGradient requires start/end coordinates, not angle strings

### 5. State Management in Workout Session

- Initialize adjustment state when exercise is completed (in handleDone)
- Apply adjustments in batch before completing session
- Use async/await for mutation sequences

## Development Workflow

1. **File Creation**: Use NativeWind classes, import from component library
2. **Data Fetching**: Use existing Supabase hooks or create new ones in feature folders
3. **Navigation**: Use Expo Router's file-based routing
4. **Styling**: Follow existing patterns with Surface, ScreenView, Button components
5. **Forms**: Use TextInput with proper styling and placeholderTextColor
6. **State Machines**: Use clear state types and separate useEffects for different concerns

## Next.js to React Native Conversion Notes

When converting from Next.js version:

- Replace `div` → `View`
- Replace `img` → `Image` (from expo-image)
- Replace `button` → `Button` (custom component)
- Replace CSS modules → NativeWind className
- Replace CSS gradients → LinearGradient component
- Replace `onClick` → `onPress`
- Replace `onChange` → `onChangeText` (for inputs)
- Remove `suppressHydrationWarning`
- Use ScreenView or ScrollView for screen containers

## Important Conventions

1. **Always** clear intervals in useEffect cleanup
2. **Never** return values from ref callbacks
3. **Use** expo-image for images with proper cachePolicy
4. **Convert** CSS gradients using gradient-parser utility
5. **Initialize** state properly before running intervals
6. **Apply** batch mutations with async/await when order matters
7. **Use** Surface for card-like components
8. **Use** BottomSheet for modals and selections
9. **Include** proper TypeScript types for all state and props
10. **Follow** NativeWind className patterns for consistency
