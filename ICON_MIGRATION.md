# Icon Library Migration

## Summary
Successfully migrated from `@phosphor-icons/react` to `react-icons` (using Heroicons v2 set).

## Changes Made

### Removed
- `@phosphor-icons/react` package

### Added
- `react-icons` package (v5.5.0)

### Icon Mappings

| Phosphor Icon | React Icons (Heroicons v2) | Usage |
|---------------|----------------------------|--------|
| `Eye` | `EyeIcon` | Password visibility toggle |
| `EyeOff` | `EyeSlashIcon` | Password visibility toggle |
| `UserPlus` | `UserPlusIcon` | Registration |
| `LogIn` | `ArrowRightOnRectangleIcon` | Login |
| `ArrowLeft` | `ArrowLeftIcon` | Back navigation |
| `CheckCircle` | `CheckCircleIcon` | Correct answers |
| `XCircle` | `XCircleIcon` | Incorrect answers |
| `SkipForward` | `ForwardIcon` | Skip word |
| `StopCircle` | `StopCircleIcon` | End round |
| `House` | `HomeIcon` | Main menu |
| `ArrowRight` | `ArrowRightIcon` | Continue/Next |
| `Users` | `UsersIcon` | Teams/multiplayer |
| `Clock` | `ClockIcon` | Timer/rounds |
| `Trophy` | `TrophyIcon` | Victory/scoring |
| `Check` | `CheckIcon` | Confirm/save |
| `SpeakerHigh` | `SpeakerWaveIcon` | Sound settings |
| `X` | `XMarkIcon` | Close/cancel |
| `Play` | `PlayIcon` | Start game |
| `Settings` | `Cog6ToothIcon` | Settings |
| `Question` | `QuestionMarkCircleIcon` | Rules/help |
| `User` | `UserIcon` | User profile |
| `Collection` | `RectangleStackIcon` | Word collections |
| `Lock` | `LockClosedIcon` | Restricted content |
| `Plus` | `PlusIcon` | Add/create |
| `Edit` | `PencilIcon` | Edit content |
| `Share` | `ShareIcon` | Share collections |
| `Trash` | `TrashIcon` | Delete |
| `Globe` | `GlobeAltIcon` | Public collections |
| `RotateCcw` | `ArrowPathIcon` | Play again |

### Size Conversion
- Phosphor `size={16}` → Heroicons `className="h-4 w-4"`
- Phosphor `size={20}` → Heroicons `className="h-5 w-5"`
- Phosphor `size={24}` → Heroicons `className="h-6 w-6"`
- Phosphor `size={32}` → Heroicons `className="h-8 w-8"`
- Phosphor `size={48}` → Heroicons `className="h-12 w-12"`
- Phosphor `size={64}` → Heroicons `className="h-16 w-16"`

### Files Modified
- `/src/components/Auth.tsx`
- `/src/components/AuthTest.tsx`
- `/src/components/GameRound.tsx`
- `/src/components/RoundResults.tsx`
- `/src/components/Rules.tsx`
- `/src/components/Settings.tsx`
- `/src/components/TeamSetup.tsx`
- `/src/components/ThemeSelection.tsx`
- `/src/components/Victory.tsx`

All icon functionality remains exactly the same, only the library and icon names have changed.