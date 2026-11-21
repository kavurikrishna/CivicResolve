import { AIAnalysis, ComplaintCategory, ComplaintPriority } from './types';
import { CATEGORIES, DEPARTMENTS } from './utils';

// Fallback AI classification when Gemini is unavailable
function getFallbackAnalysis(title: string, description: string, category: string): AIAnalysis {
  const text = `${title} ${description}`.toLowerCase();

  // Determine category from keywords
  let detectedCategory: string = category || 'Other';
  if (!category || category === 'Auto-detect') {
    if (text.includes('pothole') || text.includes('road') || text.includes('pavement') || text.includes('street damage')) {
      detectedCategory = 'Road Damage';
    } else if (text.includes('garbage') || text.includes('waste') || text.includes('bin') || text.includes('trash')) {
      detectedCategory = 'Garbage & Waste';
    } else if (text.includes('water') || text.includes('pipe') || text.includes('flood') || text.includes('drain')) {
      detectedCategory = 'Water & Drainage';
    } else if (text.includes('light') || text.includes('lamp') || text.includes('electricity')) {
      detectedCategory = 'Street Lighting';
    } else if (text.includes('sewage') || text.includes('sewer') || text.includes('smell')) {
      detectedCategory = 'Sewage';
    } else {
      detectedCategory = 'Public Infrastructure';
    }
  }

  // Determine priority from keywords
  let priority: ComplaintPriority = 'Medium';
  if (text.includes('burst') || text.includes('accident') || text.includes('emergency') || text.includes('critical') || text.includes('dangerous') || text.includes('injury')) {
    priority = 'Critical';
  } else if (text.includes('urgent') || text.includes('safety') || text.includes('hazard') || text.includes('overflow')) {
    priority = 'High';
  } else if (text.includes('minor') || text.includes('small') || text.includes('slight')) {
    priority = 'Low';
  }

  // Map to department
  const departmentMap: Record<string, string> = {
    'Road Damage': 'Roads and Infrastructure',
    'Garbage & Waste': 'Sanitation and Waste Management',
    'Water & Drainage': 'Water Supply and Drainage',
    'Street Lighting': 'Electricity and Public Lighting',
    'Sewage': 'Sewage and Plumbing',
    'Public Infrastructure': 'Public Works Department',
    'Other': 'Urban Development',
  };

  const department = departmentMap[detectedCategory] || 'Public Works Department';

  return {
    category: detectedCategory as ComplaintCategory,
    priority,
    department,
    urgency_reason: `Issue categorized as ${priority.toLowerCase()} priority based on keyword analysis of the complaint description.`,
    public_impact: `This ${detectedCategory.toLowerCase()} issue may affect residents and commuters in the reported area.`,
    recommended_action: `Assign to ${department} for assessment and resolution based on standard protocols.`,
    summary: `${detectedCategory} complaint: ${title.slice(0, 100)}`,
    is_fallback: true,
  };
}

export { getFallbackAnalysis };
