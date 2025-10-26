# Real-Time Chat App

A modern, **real-time multi-user chat application** built with **Next.js**, **WebSockets**, and **Framer Motion**.  
Join chat rooms, send instant messages, and see live typing indicators — all in a sleek UI powered by **ShadCN/UI** and **Lucide Icons**.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs)
![WebSocket](https://img.shields.io/badge/WebSocket-005A9C?style=flat&logo=websocket)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-ff0050?style=flat&logo=framer)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript)

---

## Features

- **Join / Create Chat Rooms** using 3–4 digit room IDs  
- **Real-time Messaging** powered by WebSockets  
- **Typing Indicators** (see who’s typing in real time)  
- **Live User Count** updates dynamically  
- **Smooth Animations** with Framer Motion  
- **Responsive & Minimal UI** using ShadCN/UI + Tailwind CSS  
- **Auto Disconnect Handling** on close or network issues  
- **Room Cleanup** when last user leaves  

---

## Tech Stack

| Layer | Tools / Frameworks |
|-------|--------------------|
| **Frontend** | Next.js (App Router) |
| **UI Components** | ShadCN/UI, Tailwind CSS, Lucide Icons |
| **Animations** | Framer Motion |
| **Real-Time** | Native WebSockets |
| **Backend (WebSocket Server)** | Node.js / Express / WS |
| **Language** | TypeScript |

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/20bcs9772/realtime-chat.git
cd realtime-chat
````

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_WS_URL=ws://localhost:3001/api/ws
```

> Replace the URL with your deployed WebSocket server endpoint if hosting remotely.

### 4. Run the development server

```bash
pnpm run dev
```

App runs at [http://localhost:3000](http://localhost:3000)

### 5. Run the WebSocket server

If you’re using the provided backend:

```bash
node server.js
# Runs on ws://localhost:3001/api/ws
```

---

## Usage

1. Enter your **name** and a **room ID** (e.g., `1001` or `4321`).
2. Share the room ID with others — everyone joining the same room can chat live.
3. Watch **typing indicators** and **user count** update in real time.
4. Leave anytime; the room automatically resets when all users disconnect.

---


## Deployment

You can deploy the frontend easily using:

* [Vercel](https://vercel.com/) – seamless with Next.js
* Or self-host with Node.js + Nginx
  Make sure your **WebSocket endpoint** is publicly accessible (e.g., AWS EC2, Render, or Railway).

---

