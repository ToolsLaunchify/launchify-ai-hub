// Professional Resume Template Styles
export interface TemplateStyle {
  id: string;
  name: string;
  fonts: {
    heading: string;
    body: string;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    textLight: string;
    accent: string;
  };
  layout: 'single-column' | 'two-column';
  styles: {
    headingSize: string;
    nameSize: string;
    headingWeight: string;
    bodySize: string;
    lineHeight: string;
    sectionSpacing: string;
  };
}

export const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  classic: {
    id: 'classic',
    name: 'Classic Professional',
    fonts: {
      heading: 'Georgia, serif',
      body: 'Georgia, serif',
    },
    colors: {
      primary: '#1e3a8a', // Navy blue
      secondary: '#3b82f6',
      text: '#1f2937',
      textLight: '#4b5563',
      accent: '#1e40af',
    },
    layout: 'single-column',
    styles: {
      nameSize: '2.5rem',
      headingSize: '1.375rem',
      headingWeight: '700',
      bodySize: '0.9375rem',
      lineHeight: '1.6',
      sectionSpacing: '1.75rem',
    },
  },
  modern: {
    id: 'modern',
    name: 'Modern Minimalist',
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    colors: {
      primary: '#0f172a', // Charcoal
      secondary: '#475569',
      text: '#1e293b',
      textLight: '#64748b',
      accent: '#0ea5e9',
    },
    layout: 'single-column',
    styles: {
      nameSize: '2.25rem',
      headingSize: '1.25rem',
      headingWeight: '600',
      bodySize: '0.9375rem',
      lineHeight: '1.7',
      sectionSpacing: '2rem',
    },
  },
  creative: {
    id: 'creative',
    name: 'Creative Bold',
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Open Sans, sans-serif',
    },
    colors: {
      primary: '#0d9488', // Teal
      secondary: '#14b8a6',
      text: '#111827',
      textLight: '#6b7280',
      accent: '#06b6d4',
    },
    layout: 'single-column',
    styles: {
      nameSize: '2.5rem',
      headingSize: '1.375rem',
      headingWeight: '700',
      bodySize: '0.9375rem',
      lineHeight: '1.65',
      sectionSpacing: '1.875rem',
    },
  },
  executive: {
    id: 'executive',
    name: 'Executive Premium',
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Lato, sans-serif',
    },
    colors: {
      primary: '#6d28d9', // Deep purple
      secondary: '#8b5cf6',
      text: '#18181b',
      textLight: '#52525b',
      accent: '#7c3aed',
    },
    layout: 'single-column',
    styles: {
      nameSize: '2.75rem',
      headingSize: '1.5rem',
      headingWeight: '600',
      bodySize: '0.9375rem',
      lineHeight: '1.7',
      sectionSpacing: '2rem',
    },
  },
  tech: {
    id: 'tech',
    name: 'Tech/Startup',
    fonts: {
      heading: 'Roboto Mono, monospace',
      body: 'Open Sans, sans-serif',
    },
    colors: {
      primary: '#2563eb', // Electric blue
      secondary: '#3b82f6',
      text: '#09090b',
      textLight: '#71717a',
      accent: '#1d4ed8',
    },
    layout: 'single-column',
    styles: {
      nameSize: '2.25rem',
      headingSize: '1.25rem',
      headingWeight: '600',
      bodySize: '0.9375rem',
      lineHeight: '1.65',
      sectionSpacing: '1.875rem',
    },
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    colors: {
      primary: '#0c4a6e', // Dark blue
      secondary: '#0369a1',
      text: '#0f172a',
      textLight: '#475569',
      accent: '#0284c7',
    },
    layout: 'single-column',
    styles: {
      nameSize: '2.5rem',
      headingSize: '1.375rem',
      headingWeight: '700',
      bodySize: '0.9375rem',
      lineHeight: '1.6',
      sectionSpacing: '1.75rem',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    colors: {
      primary: '#171717', // Near black
      secondary: '#404040',
      text: '#262626',
      textLight: '#737373',
      accent: '#525252',
    },
    layout: 'single-column',
    styles: {
      nameSize: '2rem',
      headingSize: '1.125rem',
      headingWeight: '600',
      bodySize: '0.875rem',
      lineHeight: '1.7',
      sectionSpacing: '2rem',
    },
  },
  academic: {
    id: 'academic',
    name: 'Academic',
    fonts: {
      heading: 'Georgia, serif',
      body: 'Georgia, serif',
    },
    colors: {
      primary: '#7c2d12', // Academic brown
      secondary: '#9a3412',
      text: '#292524',
      textLight: '#57534e',
      accent: '#a16207',
    },
    layout: 'single-column',
    styles: {
      nameSize: '2.5rem',
      headingSize: '1.375rem',
      headingWeight: '700',
      bodySize: '0.9375rem',
      lineHeight: '1.7',
      sectionSpacing: '1.875rem',
    },
  },
  sales: {
    id: 'sales',
    name: 'Sales',
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Lato, sans-serif',
    },
    colors: {
      primary: '#dc2626', // Bold red
      secondary: '#ef4444',
      text: '#1f2937',
      textLight: '#6b7280',
      accent: '#b91c1c',
    },
    layout: 'single-column',
    styles: {
      nameSize: '2.5rem',
      headingSize: '1.375rem',
      headingWeight: '700',
      bodySize: '0.9375rem',
      lineHeight: '1.65',
      sectionSpacing: '1.75rem',
    },
  },
};

export const getTemplateStyle = (templateName: string): TemplateStyle => {
  const normalizedName = templateName.toLowerCase().replace(/\s+/g, '-');
  
  // Try to match by template name
  for (const [key, style] of Object.entries(TEMPLATE_STYLES)) {
    if (normalizedName.includes(key) || key.includes(normalizedName.split('-')[0])) {
      return style;
    }
  }
  
  // Default to modern if no match
  return TEMPLATE_STYLES.modern;
};
