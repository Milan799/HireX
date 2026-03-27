# HireX 🚀

**HireX** is a modern, full-stack job hunting platform connecting talented candidates with top recruiters. Built with **Next.js 15**, **Tailwind CSS**, and **Redux Toolkit**, it features a sleek, responsive UI and a robust authentication system.

---

## ✨ Features

*   **Modern UI/UX**: Responsive design with Tailwind CSS, Framer Motion animations, and a polished dark/light theme aesthetic.
*   **Job Search**: Advanced search with filters for skills, location, and experience.
*   **Authentication**: Secure login and registration for Candidates and Recruiters.
*   **Mega Menu**: Comprehensive navigation with categorized job and company links.
*   **Summer Offer**: Interactive promotional banner for recruiters.
*   **Redux State Management**: Centralized state for user sessions and app data.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
*   **Backend (Optional)**: Express.js (included in `/server`)

---

## 🚀 Getting Started

### Prerequisites

*   Node.js 18+ installed
*   npm or yarn

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/HireX.git
cd HireX
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Ensure your `.env` contains necessary API keys (if using external services or the Express backend).

### 3. Running the App

#### Option A: Next.js Only (Recommended for Frontend Dev)

Runs the frontend with built-in API routes.

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option B: Full Stack (Frontend + Express Backend)

Runs both the Next.js frontend and the Express backend concurrently.

1.  **Install Server Dependencies**:
    ```bash
    cd server
    npm install
    cd ..
    ```
2.  **Configure Environment**:
    Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in your `.env` file.
3.  **Run Both Servers**:
    ```bash
    npm run dev:all
    ```

---

## 📂 Project Structure

```
HireX/
├── src/
│   ├── app/              # Next.js App Router pages & layouts
│   ├── components/       # Reusable UI components (Navbar, Footer, etc.)
│   ├── lib/              # Utilities, Redux store, Axios setup
│   └── styles/           # Global styles
├── server/               # Express.js backend code
├── public/               # Static assets
└── ...config files
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
