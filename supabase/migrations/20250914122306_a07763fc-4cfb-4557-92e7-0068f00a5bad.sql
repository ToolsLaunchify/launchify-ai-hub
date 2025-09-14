-- Clean up existing products with empty file attachments
UPDATE products 
SET file_attachments = '[]'::jsonb 
WHERE file_attachments IS NOT NULL 
  AND jsonb_array_length(file_attachments) > 0
  AND EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(file_attachments) as att 
    WHERE att->>'name' = '' OR att->>'url' = '' OR att->>'name' IS NULL OR att->>'url' IS NULL
  );