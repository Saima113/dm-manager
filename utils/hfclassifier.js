// utils/huggingfaceClassifier.js
const axios = require("axios");
require("dotenv").config();

const HF_TOKEN = process.env.HF_TOKEN; // Make sure you store this in your .env file
const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

// Custom labels for message intent
const labels = ["job offer", "spam", "event invite", "greeting", "query"];

async function classifyMessage(text) {
  try {
    const response = await axios.post(
      API_URL,
      {
        inputs: text,
        parameters: {
          candidate_labels: labels,
          // optional: hypothesis_template: "This message is about {}.",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
        },
      }
    );

    const label = response.data?.labels?.[0];
    const score = response.data?.scores?.[0];

    // Priority logic based on label
    let priority = "low";
    if (label === "job offer" || label === "query" || label === "event invite") {
      priority = "high";
    }

    return {
      label,
      score,
      priority,
    };
  } catch (error) {
    console.error("Zero-shot classification error:", error?.response?.data || error.message);
    return {
      label: "unknown",
      score: 0,
      priority: "low",
    };
  }
}

module.exports = classifyMessage;