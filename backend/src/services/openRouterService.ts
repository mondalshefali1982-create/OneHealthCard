import axios from 'axios';

interface AIAnalysisResult {
  summary: string;
  detectedParameters: { parameter: string; value: string; range: string; status: 'normal' | 'high' | 'low' | 'neutral' }[];
  explanation: string;
  suggestions: string[];
  warnings: string[];
}

export const analyzeMedicalReport = async (
  fileBase64: string,
  mimeType: string,
  fileName: string
): Promise<AIAnalysisResult> => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not defined in environment variables.');
  }

  // Use a capable vision model on OpenRouter, defaulting to gemini-2.5-flash
  const model = 'google/gemini-2.5-flash';
  
  const systemPrompt = `You are an expert AI Medical Assistant. Your task is to perform optical character recognition (OCR) on the uploaded medical report, analyze the contents, and return a structured JSON summary.
  
  You MUST return ONLY a valid JSON object matching this schema:
  {
    "summary": "Short 2-3 sentence overview of the report.",
    "detectedParameters": [
      { "parameter": "Parameter Name (e.g. Hemoglobin)", "value": "Value (e.g. 11.2 g/dL)", "range": "Reference Range (e.g. 12-16 g/dL)", "status": "low" }
    ],
    "explanation": "Detailed explanation of the findings in easy-to-understand terms.",
    "suggestions": ["Dietary/lifestyle suggestion 1", "Suggestion 2"],
    "warnings": ["Warning indicator or red flag 1", "Warning 2"]
  }
  
  Ensure status field is strictly one of: 'normal', 'high', 'low', 'neutral'.
  Do not include markdown code block formatting (like \`\`\`json) in your raw response. Just return the JSON object.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this medical report named "${fileName}". Here is the base64 encoded document image.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${fileBase64}`
                }
              }
            ]
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://onehealthcard.vercel.app',
          'X-Title': 'OneHealthCard'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const rawContent = response.data.choices[0]?.message?.content;
    if (!rawContent) {
      throw new Error('No content returned from OpenRouter.');
    }

    // Parse output
    const parsedData = JSON.parse(rawContent) as AIAnalysisResult;
    return parsedData;
  } catch (error: any) {
    console.error('Error during OpenRouter API call:', error.response?.data || error.message);
    throw new Error(`AI Analysis failed: ${error.response?.data?.error?.message || error.message}`);
  }
};
