import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Configure OpenAI client

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    const result = await response.blob();
    // const data = await apiResponse.json();

    const buffer = Buffer.from(await result.arrayBuffer());

    // Convert to Base64
    const base64Image = buffer.toString("base64");

    res.status(200).json({
      photo: base64Image,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error?.response?.data?.error?.message || "Internal Server Error");
  }
});

export default router;
