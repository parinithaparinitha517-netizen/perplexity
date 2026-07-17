# Perplexity AI Workspace

A full-stack AI research workspace for having persistent, context-aware conversations with an LLM. The project combines secure email-based authentication, MongoDB-backed chat history, real-time Socket.IO connectivity, and a responsive React interface designed for focused research.

## Highlights

- Persistent AI conversations with automatic thread titles
- Mistral-powered responses with full conversation context
- Email verification using signed, expiring JWT links
- Cookie-based authentication with protected user and chat routes
- Real-time client connectivity through Socket.IO
- Responsive research dashboard with searchable thread history
- Markdown, tables, links, lists, and code-block rendering
- Ownership checks for reading and deleting conversations
- Configurable CORS for local development and deployment

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Redux Toolkit, React Router, Tailwind CSS |
| UI | Lucide React, React Markdown, Remark GFM |
| Backend | Node.js, Express 5, Socket.IO |
| Data | MongoDB, Mongoose |
| AI | LangChain, Mistral AI, Google Generative AI |
| Authentication | JWT, bcrypt, HTTP-only cookies |
| Email | Nodemailer, Gmail SMTP |

## Architecture

```text
perplexity/
|-- Backend/
|   |-- server.js              # HTTP and Socket.IO bootstrap
|   `-- src/
|       |-- controllers/       # Authentication and chat workflows
|       |-- middlewares/       # JWT authentication and errors
|       |-- models/            # User, chat, and message schemas
|       |-- routes/            # REST API routes
|       |-- services/          # AI, email, and socket integrations
|       `-- validators/        # Request validation
|-- frontend/project0/
|   `-- src/
|       |-- app/               # Router and Redux store
|       `-- auth/feautures/    # Auth and chat UI, hooks, and API clients
|-- package.json               # Root convenience commands
`-- README.md
```

The Express API and Socket.IO server share one HTTP server on port `3000`. The React client runs on port `5173` and sends credentials with every authenticated request. Chats and messages are stored separately so conversation history can be loaded efficiently and supplied to the AI as ordered context.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A MongoDB database
- A Mistral API key
- A Gmail account with an app password for verification emails

### Installation

```bash
git clone https://github.com/parinithaparinitha517-netizen/perplexity.git
cd perplexity
npm run install:all
```

Create the backend environment file:

```bash
cp Backend/.env.example Backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item Backend/.env.example Backend/.env
```

Fill in the values in `Backend/.env`. Never commit this file.

### Run Locally

Start the API in one terminal:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173).

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Backend port; defaults to `3000` |
| `NODE_ENV` | Runtime environment |
| `FRONTEND_URL` | Allowed frontend origin and verification redirect target |
| `BACKEND_URL` | Public backend URL used in email links |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign authentication and verification tokens |
| `USER` | Gmail address used to send verification emails |
| `MAIL_PASSWORD` | Gmail app password |
| `MISTRAL_API_KEY` | Mistral API credential for titles and responses |
| `GOOGLE_API_KEY` | Google AI credential reserved for model integration |

The frontend can optionally set `VITE_API_URL`; it defaults to `http://localhost:3000`.

## API Overview

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/api/register` | Create an account and send verification email |
| `GET` | `/auth/api/verify-email` | Verify an email token and redirect to login |
| `POST` | `/auth/api/login` | Authenticate and set the HTTP-only cookie |
| `POST` | `/auth/api/logout` | Clear the authentication cookie |
| `GET` | `/auth/api/get-me` | Return the authenticated user |

### Chats

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/chat/api/message` | Create a thread or continue an existing one |
| `GET` | `/chat/api/` | List the current user's threads |
| `GET` | `/chat/api/messages/:chatId` | Load ordered messages for an owned thread |
| `DELETE` | `/chat/api/chats/:chatId` | Delete an owned thread and its messages |

## Engineering Notes

- Passwords are hashed through the user model before persistence.
- Authentication tokens are stored in HTTP-only cookies rather than browser storage.
- Chat queries include the authenticated user ID to prevent cross-account access.
- Verification tokens expire after one hour; session tokens expire after seven days.
- Development CORS accepts local loopback origins while production uses `FRONTEND_URL`.
- AI responses are stored with user messages, preserving context across sessions.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run install:all` | Install backend and frontend dependencies |
| `npm run dev:backend` | Start the API with Node watch mode |
| `npm run dev:frontend` | Start the Vite development server |
| `npm run build` | Create the frontend production bundle |
| `npm run lint` | Lint the frontend source |
| `npm start` | Start the backend in production mode |

## Future Improvements

- Streaming AI responses over Socket.IO
- Automated API and component tests
- Password reset and verification-email resend flows
- Deployment configuration and CI checks
- Conversation export and sharing

## Author

Built by [Parinitha](https://github.com/parinithaparinitha517-netizen) as a full-stack portfolio project demonstrating React architecture, secure Node.js APIs, persistent data modeling, and applied LLM integration.
