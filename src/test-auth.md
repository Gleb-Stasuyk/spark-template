# Testing the Registration System

The registration system has been successfully integrated into the Alias game application. Here's how to test it:

## How to Test Registration:

### 1. Access Registration Screen
- Load the application
- Click the "Login / Register" button on the theme selection screen
- OR click on the "Custom" theme card (which requires authentication)

### 2. Registration Form Features
- **Username field**: Required, checked for uniqueness
- **Email field**: Required, validated for proper email format, checked for uniqueness  
- **Password field**: Required, minimum 6 characters, with show/hide toggle
- **Confirm Password field**: Required, must match password, with show/hide toggle

### 3. Registration Validation
The system validates:
- ✅ Username is not empty
- ✅ Email format is valid (contains @ and domain)
- ✅ Password is at least 6 characters
- ✅ Passwords match
- ✅ Username doesn't already exist
- ✅ Email isn't already registered

### 4. Registration Flow
1. Fill out the registration form
2. Click "Create Account" 
3. System stores user data in KV storage under 'alias-users'
4. Success toast notification appears
5. User is automatically logged in
6. Redirected to theme selection with user info displayed

### 5. Sample Test Data
You can test with these sample credentials:

**Test User 1:**
- Username: `testuser1`
- Email: `test1@example.com`
- Password: `password123`

**Test User 2:**
- Username: `gamemaster`
- Email: `gm@aliasapp.com` 
- Password: `aliasrocks`

### 6. Post-Registration Features
After registration, users can:
- See their username displayed in the top-right corner
- Access custom word collections
- Logout and login again
- Create custom word collections (if that feature is implemented)

### 7. Error Testing
Try these scenarios to test error handling:
- Empty username → "Username is required"
- Invalid email (missing @ or domain) → "Please enter a valid email address"
- Short password (less than 6 chars) → "Password must be at least 6 characters long"
- Mismatched passwords → "Passwords do not match"
- Duplicate username → "Username already exists"
- Duplicate email → "Email already registered"

### 8. UI Features
- Password visibility toggles (eye icons)
- Loading states during registration
- Tab switching between Login and Register
- Responsive design
- Toast notifications for feedback
- Proper form validation and user experience

The registration system is now fully functional and ready for user testing!