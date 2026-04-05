# 📂 Flow — Finance Dashboard

A clean, high-performance finance management dashboard built to demonstrate modern frontend architecture, data visualization, and responsive UI design.

---

## 🚀 Overview

**Flow** is a comprehensive financial tracking interface designed for clarity and usability. It provides users with real-time insights into their spending habits, transaction history, and account balances through an intuitive, role-based dashboard.

### 🧠 Key Highlights
* **Component-Based Architecture:** Scalable and reusable UI patterns.
* **Separation of Concerns:** Distinct layers for logic (hooks), state (context), and presentation.
* **Data-Driven Design:** Focuses on turning raw JSON data into actionable visual insights.
* **Recruiter-Focused:** Built with a "real-world product" approach rather than just a coding exercise.

---

## ✨ Features

### 🎨 UI / UX
* **Minimalist Interface:** Clean, readable, and distraction-free design.
* **Fully Responsive:** Optimized for mobile, tablet, and desktop viewing.
* **Edge Case Handling:** Robust UI states for "Empty Data," "Loading," and "No Search Results."

### 📊 Requirement Implementation
| Requirement | Implementation |
| :--- | :--- |
| **Dashboard Overview** | Summary cards + interactive charts |
| **Transactions Section** | Table with filter, search, and sort functionality |
| **Role-Based UI** | Viewer/Admin toggle for conditional rendering |
| **Insights** | Data-driven observations and trends |
| **State Management** | Centralized state using Context API/Zustand |

---

## 🛠 Tech Stack

* **Frontend:** React.js
* **Styling:** Tailwind CSS
* **Charts:** Recharts / Chart.js
* **State Management:** Context API / Zustand
* **Data:** Mock JSON

---

## 📁 Project Structure

```text
src/
├── components/   # Reusable UI elements (Buttons, Tables, Cards)
├── pages/        # Main view components (Dashboard, Settings)
├── hooks/        # Custom React hooks for logic reuse
├── context/      # Global state management (Context API)
├── utils/        # Helper functions and data formatters
└── data/         # Mock data files and constants
```

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/raihanbashir/Flow---Finance-Dashboard.git

# Navigate to project folder
cd Flow---Finance-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```
---

## 💡 Technical Decisions & Implementation

### **Custom Hooks for Data Fetching**
To maintain a clean component tree, I implemented custom hooks (e.g., `useTransactions`) to handle data filtering and sorting logic. This ensures that the UI components remain declarative and only focus on rendering.

### **State Management Strategy**
I chose **[Context API / Zustand]** over Redux for this project to minimize boilerplate while maintaining a single source of truth. This allows for seamless role-switching (Viewer/Admin) across the entire application without "prop-drilling."

### **Performance Optimization**
- **Memoization:** Used `useMemo` for heavy data filtering calculations to prevent unnecessary re-renders.
- **Component Lazy Loading:** Implemented `React.lazy` and `Suspense` for page-level code splitting.

---

## 🔥 Optional Enhancements & Roadmap
- [ ] **Dark Mode:** System-wide theme toggling using Tailwind's `dark:` classes.
- [ ] **Local Storage:** Persistence for user settings and role-based preferences.
- [ ] **Animations:** Smooth transitions using Framer Motion for a premium feel.
- [ ] **Export Functionality:** Ability to download transaction history as CSV or PDF.

---

## 🙌 Author

**Raihan Bashir** *Computer Science Student @ [Your University]*

- **GitHub:** [@raihanbashir](https://github.com/raihanbashir)
- **LinkedIn:** [linkedin.com/in/yourprofile](https://www.linkedin.com/in/raihanbashir/)

---

> This project was built as a demonstration of frontend proficiency and UI/UX principles for recruiter evaluation.
