# Tactile UI Flow - BasketApp

A collaborative savings application built with React, TypeScript, and Supabase.

## Features

- **Anonymous-First Authentication**: Users can use the app without signing up
- **Multiple Login Options**: Email, Google, WhatsApp, or continue as guest
- **Collaborative Savings**: Create and join savings baskets with friends and family
- **Real-time Updates**: Live updates for contributions and progress
- **Mobile-First Design**: Optimized for mobile devices
- **PWA Support**: Install as a progressive web app

## Authentication System

The app uses a robust Supabase authentication system with the following features:

### Anonymous-First Approach
- Users can access all features without creating an account
- Anonymous sessions are automatically created when needed
- Data is preserved across sessions using localStorage

### Optional Authentication Methods
1. **Continue as Guest**: Instant access with anonymous session
2. **Email Login**: Magic link or password-based authentication
3. **Google OAuth**: One-click sign-in with Google account
4. **WhatsApp**: Phone number verification via WhatsApp

### User Data Structure
```typescript
interface AuthUser {
  id: string;
  displayName: string;
  email?: string;
  country: string;
  language: 'en' | 'rw';
  mobileMoneyNumber?: string;
  whatsappNumber?: string;
  isAnonymous: boolean;
  authMethod: 'anonymous' | 'email' | 'google' | 'whatsapp';
}
```

## Development

### Prerequisites
- Node.js 18+
- npm or bun
- Supabase account

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run migrations: `supabase db push`
5. Start development server: `npm run dev`

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Testing Authentication
Visit `/ui-showcase` to test all authentication methods in the development environment.

## Database Schema

### Users Table
- `id`: UUID (primary key)
- `email`: TEXT (optional)
- `phone_number`: TEXT (optional)
- `display_name`: TEXT
- `country`: TEXT (default: 'RW')
- `is_anonymous`: BOOLEAN
- `auth_method`: TEXT ('anonymous', 'email', 'google', 'whatsapp')
- `mobile_money_number`: TEXT
- `whatsapp_number`: TEXT

### RLS Policies
- Anonymous users can create and view baskets
- Users can only contribute to baskets in their own country
- All users have access to their own data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Project info

**URL**: https://lovable.dev/projects/934dd5e2-d55b-41c0-80c2-eabb89303857

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/934dd5e2-d55b-41c0-80c2-eabb89303857) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/934dd5e2-d55b-41c0-80c2-eabb89303857) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
