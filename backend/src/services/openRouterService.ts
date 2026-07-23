const MOCK_RESPONSE = {
  reportType: "Blood Test",
  summary: "The patient shows slightly elevated cholesterol levels. Other parameters are within normal range.",
  vitals: "N/A",
  abnormalIndicators: ["High Cholesterol"],
  recommendations: ["Reduce dietary fats", "Exercise regularly"]
};

export const analyzeMedicalReportText = async (text: string) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return MOCK_RESPONSE;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a medical assistant. Analyze the given medical report and provide a JSON response with the following keys: reportType, summary, vitals, abnormalIndicators (array), recommendations (array). Provide ONLY JSON, nothing else." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonStr = content.match(/\{[\s\S]*\}/)?.[0] || content;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return MOCK_RESPONSE;
  }
};
