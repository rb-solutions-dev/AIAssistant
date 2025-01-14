const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
const math = require("mathjs"); // Import mathjs for advanced calculations

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI API setup
const openai = new OpenAI({
    apiKey: "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", // Replace with your OpenAI API key
});

// Improved regex to detect more complex math queries
const isMathQuery = (query) => {
  // This regex matches numbers, operations (+, -, *, /), parentheses, and common math functions (sin, cos, log, etc.)
  const mathRegex = /[0-9+\-*/^().\s]|sin|cos|tan|log|ln|sqrt|exp|π|e/i;
  return mathRegex.test(query);
};

// Function to evaluate complex math expressions
const evaluateMath = (expression) => {
  try {
    return math.evaluate(expression); // Safe evaluation with mathjs
  } catch (error) {
    return "Error: Invalid mathematical expression"; // Return error if invalid
  }
};

// Endpoint for handling user queries
app.post("/chat", async (req, res) => {
  const { query } = req.body;

  try {
    if (isMathQuery(query)) {
      // If it's a math query, evaluate the math expression first
      const result = evaluateMath(query);
      
      // If result is valid, return it directly
      if (typeof result === "number") {
        return res.json({ message: `The result is: ${result}` });
      } else {
        // If math evaluation fails, ask ChatGPT to explain the issue
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Use the model best suited for your bot
          messages: [
            { role: "user", content: `Can you explain how to calculate the result of: ${query}?` },
          ],
        });
        return res.json({
          message: `ChatGPT's explanation: ${response.choices[0].message.content.trim()}`,
        });
      }
    } else {
      // If it's not math, send it to OpenAI for processing
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use the appropriate model for the conversation
        messages: [{ role: "user", content: query }],
      });
      const answer = response.choices[0].message.content.trim();
      return res.json({ message: answer });
    }
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
