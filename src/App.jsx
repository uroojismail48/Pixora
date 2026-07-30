import { useState } from "react";
import Prompt from "./pro";

function App() {
  const [input, setInput] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  function RandomGen() {
    const randomPrompt =
      Prompt[Math.floor(Math.random() * Prompt.length)];

    setInput(randomPrompt);
  }

  async function generate() {
    if (!input.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-3-medium-diffusers",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: input,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error(error);
        alert("Failed to generate image.");
        return;
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      setImage(imageUrl);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-black flex justify-center items-center p-5">
      <div className="w-full max-w-3xl bg-zinc-900 text-white rounded-3xl border-2 border-purple-700 p-8 flex flex-col gap-6">

        <h1 className="text-5xl font-bold text-center">
          AI Image Generator
        </h1>

        <textarea
          className="w-full h-36 rounded-xl p-4 text-lg bg-zinc-800 border border-purple-600 outline-none resize-none"
          placeholder="Describe the image you want..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-4 justify-center">
          <button
            onClick={RandomGen}
            className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-xl font-semibold"
          >
            Random Prompt
          </button>

          <button
            onClick={generate}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Image"}
          </button>
        </div>

        {image && (
          <div className="flex justify-center">
            <img
              src={image}
              alt="Generated"
              className="rounded-2xl shadow-lg max-w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;