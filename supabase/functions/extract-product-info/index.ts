import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Extracting product info from URL:', url);

    // Step 1: Fetch the webpage content
    const webpageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!webpageResponse.ok) {
      throw new Error(`Failed to fetch webpage: ${webpageResponse.statusText}`);
    }

    const html = await webpageResponse.text();
    console.log('Successfully fetched webpage, length:', html.length);

    // Step 2: Extract basic metadata and content
    const metaData = extractMetadata(html);
    const textContent = extractTextContent(html);
    
    console.log('Extracted metadata and content');

    // Step 3: Use Lovable AI to analyze and structure the content
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiPrompt = `Analyze this product webpage and extract structured information.

URL: ${url}
Meta Title: ${metaData.title || 'N/A'}
Meta Description: ${metaData.description || 'N/A'}
Content Preview: ${textContent.substring(0, 3000)}

Extract and return ONLY valid JSON with this exact structure:
{
  "name": "Product name",
  "slug": "url-friendly-slug",
  "description": "Brief 1-2 sentence description",
  "rich_description": "Detailed HTML description with features and benefits",
  "image_url": "Main product image URL (absolute URL)",
  "original_price": 99.99,
  "discounted_price": 49.99,
  "currency": "USD",
  "affiliate_link": "Product purchase/demo link",
  "cta_button_text": "Main call-to-action text",
  "product_type": "software|tool|course|template|other",
  "product_tags": ["tag1", "tag2", "tag3"],
  "meta_title": "SEO optimized title",
  "meta_description": "SEO meta description",
  "keywords": ["keyword1", "keyword2"],
  "focus_keyword": "main SEO keyword",
  "faq_data": [
    {"question": "Q1?", "answer": "A1"},
    {"question": "Q2?", "answer": "A2"}
  ],
  "howto_data": [
    {"step": 1, "title": "Step title", "description": "Step description"},
    {"step": 2, "title": "Step title", "description": "Step description"}
  ],
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "use_cases": ["Use case 1", "Use case 2"],
  "stats_data": {
    "users": 10000,
    "satisfaction_rate": 95,
    "time_saved": "50%"
  },
  "suggested_category": "ai-tools",
  "confidence_scores": {
    "name": 0.95,
    "description": 0.90,
    "pricing": 0.85,
    "overall": 0.90
  }
}

Rules:
- Extract actual content from the webpage
- If pricing not found, set to null
- Use the actual product URL for affiliate_link if no specific link found
- Generate slug from product name (lowercase, hyphens)
- Identify product type based on content
- Extract or generate relevant keywords
- Create FAQ from content or set empty array
- Suggest best matching category
- Provide confidence scores (0.0 to 1.0) for data quality`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a product data extraction specialist. Extract structured product information from webpage content and return valid JSON only.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error('AI analysis failed');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    console.log('AI response received, parsing JSON...');

    // Parse AI response and extract JSON
    let extractedData;
    try {
      // Try to find JSON in the response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        extractedData = JSON.parse(aiContent);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Add original URL and additional metadata
    extractedData.tool_url = url;
    extractedData.source_url = url;
    
    // Calculate missing fields
    const allFields = ['name', 'description', 'rich_description', 'image_url', 'original_price', 
                       'faq_data', 'howto_data', 'features', 'benefits'];
    const missingFields = allFields.filter(field => 
      !extractedData[field] || 
      (Array.isArray(extractedData[field]) && extractedData[field].length === 0)
    );

    console.log('Successfully extracted product data');

    return new Response(
      JSON.stringify({
        success: true,
        data: extractedData,
        missing_fields: missingFields,
        extraction_date: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in extract-product-info:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function to extract metadata from HTML
function extractMetadata(html: string) {
  const metadata: any = {};
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) metadata.title = titleMatch[1].trim();
  
  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch) metadata.description = descMatch[1].trim();
  
  // Extract og:title
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (ogTitleMatch && !metadata.title) metadata.title = ogTitleMatch[1].trim();
  
  // Extract og:description
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (ogDescMatch && !metadata.description) metadata.description = ogDescMatch[1].trim();
  
  // Extract og:image
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (ogImageMatch) metadata.image = ogImageMatch[1].trim();
  
  return metadata;
}

// Helper function to extract text content (simplified)
function extractTextContent(html: string): string {
  // Remove scripts and styles
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags but keep content
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}
