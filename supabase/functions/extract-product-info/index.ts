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

    // Step 2: Extract comprehensive metadata and full content
    const metaData = extractMetadata(html);
    const textContent = extractTextContent(html).substring(0, 15000); // Increased to 15K chars for detailed analysis
    
    console.log('Extracted metadata and content');

    // Step 3: Use Lovable AI to analyze and structure the content
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiPrompt = `You are an expert product reviewer and content creator. Analyze this product webpage and create a COMPREHENSIVE, DETAILED product review article.

URL: ${url}
Meta Title: ${metaData.title || 'N/A'}
Meta Description: ${metaData.description || 'N/A'}
OG Image: ${metaData.image || 'N/A'}

Full Page Content (15,000 characters):
${textContent}

CRITICAL INSTRUCTIONS:
1. Write a COMPLETE product review article (minimum 1200 words) for the "rich_description" field
2. Use proper semantic HTML with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <table> tags
3. Make it comprehensive like a professional product review blog post
4. Include real examples, specific use cases, and detailed explanations
5. Extract ALL features, pricing tiers, and benefits you can find
6. If information is limited, extrapolate based on product type and typical offerings

REQUIRED ARTICLE STRUCTURE FOR rich_description (MUST INCLUDE ALL SECTIONS):

<div class="product-review">
  <h2>Overview</h2>
  <p>Write 3-4 detailed paragraphs (250-350 words) explaining:
  - What this product is and what problem it solves
  - Who created it and their credibility/background
  - Key value proposition and main benefits
  - Any impressive statistics or achievements mentioned</p>
  
  <h2>Key Features & Capabilities</h2>
  <p>Introduce the feature set, then list them:</p>
  <ul>
    <li><strong>Feature Name:</strong> 2-3 sentence detailed explanation of how it works and why users need it. Include specific examples of application.</li>
    <!-- MINIMUM 6-10 features - extract all you can find -->
  </ul>
  
  <h2>How It Works</h2>
  <p>Explain the user workflow in detail (150-200 words). Break down the process:</p>
  <ol>
    <li><strong>Step Title:</strong> Detailed description of this step</li>
    <!-- 3-5 steps minimum -->
  </ol>
  
  <h2>Pros & Cons</h2>
  <h3>✓ Advantages</h3>
  <ul>
    <li>Specific benefit with explanation of impact (not just "fast" but "Processes data 10x faster than traditional methods")</li>
    <!-- List 6-8 distinct pros -->
  </ul>
  <h3>✗ Considerations</h3>
  <ul>
    <li>Honest limitation or learning curve consideration</li>
    <!-- List 3-5 cons or considerations -->
  </ul>
  
  <h2>Who Should Use [Product Name]?</h2>
  <p>Detailed analysis (200-250 words) of ideal user personas:</p>
  <ul>
    <li><strong>User Type 1 (e.g., "Small Business Owners"):</strong> Why this product is perfect for them, specific use case example</li>
    <li><strong>User Type 2:</strong> Another persona with use case</li>
    <!-- 4-6 different user personas -->
  </ul>
  
  <h2>Pricing & Value</h2>
  <p>Comprehensive pricing breakdown. If specific pricing found, create table. If not, describe pricing model:</p>
  <!-- If pricing data exists: -->
  <table>
    <tr><th>Plan</th><th>Price</th><th>Best For</th></tr>
    <tr><td>Plan name</td><td>$X/mo</td><td>Description</td></tr>
  </table>
  <!-- If no pricing: -->
  <p>Describe whether it's free, freemium, premium, enterprise pricing, etc. Discuss value proposition.</p>
  
  <h2>Real-World Use Cases</h2>
  <p>Provide 5-7 specific scenarios with detailed examples (250-300 words total):</p>
  <ul>
    <li><strong>Use Case 1 Title:</strong> Detailed scenario showing how a specific user type would use this product to achieve a specific outcome. Include before/after or expected results.</li>
    <!-- 5-7 concrete use cases -->
  </ul>
  
  <h2>Comparison & Position in Market</h2>
  <p>How this product compares to alternatives (100-150 words). If competitor names mentioned, include them. Otherwise, discuss product category positioning.</p>
  
  <h2>Getting Started</h2>
  <p>Step-by-step guide on how to begin using the product (100-150 words):
  - Signup/access process
  - Initial setup or onboarding
  - First actions to take
  - Tips for quick wins</p>
  
  <h2>Final Verdict</h2>
  <p>Comprehensive conclusion (200-250 words):
  - Summarize key strengths
  - Address main weaknesses honestly
  - Clear recommendation on who should use it
  - Overall rating sentiment (highly recommended / recommended / recommended with caveats)
  - Best use case summary</p>
</div>

Extract and return ONLY valid JSON with ALL these fields:
{
  "name": "Exact product name from page",
  "slug": "url-friendly-slug",
  "description": "Compelling 2-3 sentence elevator pitch that hooks readers",
  "rich_description": "COMPLETE HTML ARTICLE following structure above - MINIMUM 1200 WORDS - DO NOT ABBREVIATE",
  "image_url": "Primary product image URL (absolute URL from og:image or main product image)",
  "original_price": null or number,
  "discounted_price": null or number,
  "currency": "USD/EUR/INR/etc",
  "affiliate_link": "Main product/demo/signup URL",
  "payment_link": "Purchase or pricing page URL if different",
  "cta_button_text": "Primary call-to-action text (e.g., 'Start Free Trial', 'Get Started', 'Learn More')",
  "product_type": "software/saas/tool/course/template/ebook/service/hardware",
  "product_tags": ["comprehensive", "array", "of", "10-15", "relevant", "tags"],
  "meta_title": "SEO-optimized meta title (55-60 characters)",
  "meta_description": "Compelling SEO meta description (150-160 characters)",
  "keywords": ["primary", "keyword", "list", "10-15 items"],
  "related_keywords": ["semantic", "variations", "of", "keywords", "10-15 items"],
  "focus_keyword": "Single primary SEO target keyword",
  "seo_title": "H1-optimized title for landing page",
  "social_title": "Shareable social media title",
  "social_description": "Social media description (optimized for engagement)",
  "faq_data": [
    {"question": "Detailed question users ask", "answer": "Comprehensive answer (2-3 sentences)"}
  ],
  "howto_data": [
    {"step": 1, "title": "Clear step title", "description": "Detailed step description with specifics"}
  ],
  "features": ["Complete list of ALL features found - aim for 8-15 items"],
  "benefits": ["User-centric benefits explaining real value - 6-10 items"],
  "pros": ["Specific advantages with context - 6-8 items"],
  "cons": ["Honest limitations or considerations - 3-5 items"],
  "use_cases": ["Specific real-world application scenarios - 5-7 items"],
  "target_audience": "Detailed description of ideal users (2-3 sentences)",
  "pricing_tiers": [
    {"name": "Plan name", "price": number or "Custom", "currency": "USD", "features": ["included features list"]}
  ],
  "suggested_category": "best-matching-category-slug",
  "is_free": true/false,
  "tool_url": "Direct product URL",
  "demo_url": "Demo or trial URL if mentioned",
  "video_urls": ["YouTube/Vimeo URLs if any embedded videos found"],
  "screenshots": ["Additional product screenshot URLs beyond main image"],
  "testimonials": [
    {"quote": "User testimonial text", "author": "Person Name", "role": "Title/Company if mentioned"}
  ],
  "confidence_scores": {
    "name": 0.95,
    "description": 0.90,
    "rich_description": 0.85,
    "pricing": 0.80,
    "overall": 0.88
  }
}

CRITICAL REQUIREMENTS:
- rich_description MUST be a COMPLETE article of 1200+ words minimum
- DO NOT use placeholders or ellipsis (...) - write full content
- Extract REAL data from the webpage, don't make up information
- If data is sparse, write based on product type best practices
- Use professional, engaging writing style
- Include specific numbers, statistics, and concrete examples wherever possible
- Return ONLY valid JSON with no additional commentary`;

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
            content: 'You are an expert product reviewer and content strategist. Your task is to create comprehensive, detailed product review articles that inform and engage readers. Extract all available data from webpages and generate professional content. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
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
