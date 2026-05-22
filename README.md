# 📰 React News Headlines App (TypeScript)

A simple **React + TypeScript** application that fetches and displays the latest news headlines using the **NewsAPI**.

The project demonstrates how to fetch API data on component mount, use controlled inputs with dropdown filters, and dynamically render data in a React UI.

---
![newsapp1](https://github.com/user-attachments/assets/cd02c002-64e3-498c-8a8b-51b6026491d3)
---
## 🚀 Features

* Fetch **top headlines** from NewsAPI
* Default news loads when the component mounts
* **Dropdown filter** to select different categories
* Automatically **refetch news when category changes**
* Display:

  * News title
  * Description
  * Link to full article

---

## 🧠 Concepts Practiced

This project focuses on core React concepts:

* **API Fetching with `fetch()`**
* **React Hooks**

  * `useState`
  * `useEffect`
* **Controlled Components** (Dropdown filter)
* **Re-fetching data on state change**
* **Mapping API data into UI components**
* **TypeScript interfaces for API data**

---

## 🏗 Project Structure

```
src
 ├── App.tsx
 ├── Loader.tsx
 ├── News1.tsx
 └── index.tsx
```

**NewsApp.tsx**

* Handles API fetching
* Contains category dropdown
* Maps news articles to UI

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/news-headlines-app.git
```

Navigate to the project folder:

```bash
cd news-headlines-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 🔑 API Setup

This project uses **NewsAPI**.

1. Create an account at
   https://newsapi.org

2. Get your **API Key**

3. Add it in `NewsApp.tsx`:

```ts
const API_KEY = "YOUR_API_KEY";
```

---

## 🌍 API Endpoint Used

```
https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}

```

Parameters used:

| Parameter | Description           |
| --------- | --------------------- |
| country   | Country for headlines |
| category  | News category         |
| apiKey    | Your NewsAPI key      |

---

## 🧩 Categories Supported

* General
* Business
* Entertainment
* Health
* Science
* Sports
* Technology

---

## 📸 UI Behavior

1. App loads → fetch **default headlines**
2. User selects category → **state updates**
3. `useEffect` triggers → **API refetch**
4. News list **re-renders**

---

## 📚 Learning Outcome

After completing this project, you will understand:

* How React handles **side effects**
* How to **trigger API calls based on state**
* How to convert **external JSON data into UI**
* How **TypeScript improves reliability** in React apps

---

## 🔮 Future Improvements

Possible enhancements:

* Add **loading spinner**
* Add **error handling**
* Display **news images**
* Add **search functionality**
* Implement **pagination / load more**
* Improve UI with **Material UI or Tailwind**

---

## 🛠 Tech Stack

* React
* TypeScript
* NewsAPI
* Fetch API

---

## 📜 License

Made by :
**Akash Bhattacharyya**.




