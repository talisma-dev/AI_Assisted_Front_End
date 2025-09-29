export async function generateContent({ student_id, module_id, course_id, concept, default_blooms_level, student_profile_tag }) {
  const response = await fetch('https://athenalms.slingo.ai/agent/course/generate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id, module_id, course_id, concept, default_blooms_level, student_profile_tag }),
  });
  if (!response.ok) throw new Error('Failed to generate content');
  return response.json();
} 