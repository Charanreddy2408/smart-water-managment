// Gemini API integration for water quality analysis
const GEMINI_API_KEY = 'AIzaSyCigCx2dPDhm2TyOCdJLgQ3Trd_rOb3LDs';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;

/**
 * Get a water quality report from Gemini
 * @param {Object} readings - { TDS, Temperature, Turbidity, pH }
 * @returns {Promise<string>} - Gemini's report
 */
export async function getGeminiWaterReport(readings) {
  const prompt = `You are an expert in water quality. Given these sensor readings:\n\nTDS: ${readings.TDS} ppm\nTemperature: ${readings.Temperature} °C\nTurbidity: ${readings.Turbidity} NTU\npH: ${readings.pH}\n\n1. Give a simple, clear overall water quality report for a layperson.\n2. List any health or usage impacts.\n3. Suggest actions if needed.\nKeep it short, friendly, and easy to understand.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const res = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Gemini API error');
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No report generated.';
} 