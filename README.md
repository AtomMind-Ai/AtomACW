# AI Essay - Acedemic Writing Assistant

A one-page academic writing workspace with **rich text editing**, **inline AI comments**, and **Cerebras-powered suggestions, reviews, and chat**. Supports local `.txt` and `.docx` files, with persistent comments and Quick Fix features.

---

## Project Structure

```

ai-essay-assistant/
├─ frontend/
│  ├─ package.json
│  ├─ vite.config.js
│  └─ src/
│     ├─ App.jsx
│     ├─ index.js
│     ├─ styles.css
│     ├─ components/
│     │  ├─ Editor.jsx
│     │  ├─ CommentPanel.jsx
│     │  └─ ChatDrawer.jsx
│     └─ utils/
│        ├─ api.js
│        └─ fileUtils.js
├─ main.py
├─ requirements.txt
└─ .env

```

---

## Backend

### Environment Variables

`.env`

```

CEREBRAS_API_KEY=your_real_api_key_here

````

### Dependencies

`backend/requirements.txt`

```txt
fastapi
uvicorn
python-dotenv
httpx
pydantic
cerebras-cloud-sdk
````

### Start Backend

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## Frontend

### Dependencies

`frontend/package.json`

```json
{
  "name": "frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tiptap/react": "^2.2.0",
    "@tiptap/starter-kit": "^2.2.0",
    "file-saver": "^2.0.5",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.403.0",
    "mammoth": "^1.6.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-hotkeys-hook": "^4.5.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.36.0",
    "@types/react": "^19.1.16",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.4",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.36.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.22",
    "globals": "^16.4.0",
    "postcss": "^8.5.6",
    "vite": "^7.1.7"
  }
}
```

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **[http://localhost:5173](http://localhost:5173)** (Vite default)

---

## Features

* Rich text editing with **Tiptap**
* **AI Comments Panel** (grammar, clarity, suggestions)
* **Quick Fix** for AI suggestions
* **Persistent comments** stored in localStorage
* **Cerebras AI** powered:

  * `Suggest` — improve text
  * `Review` — academic review with JSON comments
  * `Chat` — ask questions about the essay
* **Local file I/O** for `.txt` and `.docx`
* Keyboard shortcuts:

  * `Ctrl+Enter` → toggle AI Chat Drawer
  * `Ctrl+S` → save document locally

---

## Usage

1. **Open / Edit** a `.txt` or `.docx` file.
2. **Click "AI Review"** to generate comments.
3. **Quick Fix** suggestions directly from the panel.
4. **Chat with AI** using the drawer (`Ctrl+Enter`).
5. **Save** your document locally (`Ctrl+S`).

---

## Notes

* All processing is local **except API calls to Cerebras**.
* Comments are persisted **locally** in your browser.
* Supports only `.txt` and `.docx` files for now.

---

## Links

* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
