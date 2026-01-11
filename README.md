# Dua & Blogs Website

A modern Blog and Dua website built with Next.js and Supabase.

## Features

- 📝 **Blogs** - Create and manage blog posts with images
- 🤲 **Duas** - Share duas with Arabic text, transliteration, and translations
- 🔍 **Search** - Full-text search across blogs and duas
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive** - Works on all devices
- 💬 **WhatsApp Integration** - Floating feedback button with pre-filled messages
- 🖼️ **Image Compression** - Automatic client-side compression to ~250KB
- 🔐 **Admin Panel** - Full CRUD for managing content
- ✏️ **Rich Text Editor** - WYSIWYG editor for blogs with headings, formatting, highlights, lists
- 🔝 **Scroll-to-Top** - Automatic scroll to top on page navigation

## Getting Started

### 1. Set up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the contents of `supabase-setup.sql`
4. Go to **Storage** and create a new bucket called `images` (make it public)
5. Copy your project URL and anon key from **Settings > API**

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ADMIN_SESSION_SECRET=any_random_string_here
```

> ⚠️ **Note**: `SUPABASE_SERVICE_ROLE_KEY` is required for admin login. Get it from **Settings > API > service_role**

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Access Admin Panel

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`
3. **IMPORTANT**: Change your password after first login

## Deploying to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

Build command: `npm run build`
Publish directory: `.next`

## Project Structure

```
src/
├── app/
│   ├── page.js              # Home page
│   ├── blogs/               # Blog pages
│   ├── duas/                # Dua pages
│   ├── search/              # Search results
│   ├── admin/               # Admin panel
│   └── api/                 # API routes
├── components/              # React components
└── lib/                     # Utilities
```

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

⚠️ Change these after first login!

## Tech Stack

| Package | Version | Description |
|---------|---------|-------------|
| next | 16.1.1 | React framework |
| react | 19.2.3 | UI library |
| @supabase/supabase-js | ^2.89.0 | Database & auth |
| react-quill-new | ^3.7.0 | Rich text editor |
| lucide-react | ^0.562.0 | Icons |
| bcryptjs | ^3.0.3 | Password hashing |
| browser-image-compression | ^2.0.2 | Image compression |

## License

MIT
