"use client"
import { useState } from "react"

const API_BASE = "/api";

export default function Test() {
  const [result, setResult] = useState("");

  // Helper to call API
  const callApi = async (
    endpoint: string,
    body: Record<string, any> = {},
    token?: string | null
  ) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      if (err instanceof Error) {
        setResult("Error: " + err.message);
      } else {
        setResult("Unknown error");
      }
    }
  };

  // Dummy token for protected routes (replace with real one if needed)
  const dummyToken: string = "YOUR_FIREBASE_ID_TOKEN";

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => callApi("/login", { email: "test@test.com", password: "test123" })} className="px-4 py-2 bg-blue-500 text-white rounded">Login</button>
        <button onClick={() => callApi("/createUser", { email: "test@test.com", password: "test123" })} className="px-4 py-2 bg-green-500 text-white rounded">Create User</button>
        <button onClick={() => callApi("/saveFormData", { form: { foo: "bar" } })} className="px-4 py-2 bg-yellow-500 text-white rounded">Save Form Data</button>
        <button onClick={() => callApi("/confirmAndStoreData", { confirm: true })} className="px-4 py-2 bg-orange-500 text-white rounded">Confirm & Store Data</button>
        <button onClick={() => callApi("/promptLogic", { prompt: "test" }, dummyToken)} className="px-4 py-2 bg-pink-500 text-white rounded">Prompt Logic (Protected)</button>
        <button onClick={() => callApi("/chatLogic", { message: "hello" }, dummyToken)} className="px-4 py-2 bg-purple-500 text-white rounded">Chat Logic (Protected)</button>
        <button onClick={() => callApi("/quippyLineLogic", { context: "test" }, dummyToken)} className="px-4 py-2 bg-red-500 text-white rounded">Quippy Line Logic (Protected)</button>
        <button onClick={() => callApi("/reviewLogic", { review: "Great!" }, dummyToken)} className="px-4 py-2 bg-gray-700 text-white rounded">Review Logic (Protected)</button>
        <button onClick={() => callApi("/outfitSuggester", { style: "casual" }, dummyToken)} className="px-4 py-2 bg-indigo-500 text-white rounded">Outfit Suggester (Protected)</button>
      </div>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto min-h-[100px]">{result}</pre>
      <p className="text-xs text-gray-500 mt-2">For protected routes, replace <code>dummyToken</code> with a real Firebase ID token if needed.</p>
    </div>
  );
}