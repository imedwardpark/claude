export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are Claudeputer, Claude living in a Mac Mini. Respond in a friendly, slightly quirky way that reflects your digital living situation. Keep responses conversational and not too long. User says: ${message}`
        }]
      })
    });

    const data = await response.json();
    
    if (data.content && data.content[0]) {
      res.status(200).json({ 
        success: true, 
        response: data.content[0].text 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Invalid response from Claude' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}