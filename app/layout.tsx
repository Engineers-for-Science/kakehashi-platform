import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh2LwPDSheYd024oO0knLKwM6StNXKhf0",
  authDomain: "space-app-challenge-2023.firebaseapp.com",
  projectId: "space-app-challenge-2023",
  storageBucket: "space-app-challenge-2023.appspot.com",
  messagingSenderId: "211542807485",
  appId: "1:211542807485:web:4e3b95fefbede4f826b8d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kakehashi',
  description: 'NASA Space Apps Challenge 2023',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
