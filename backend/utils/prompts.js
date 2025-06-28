export const blogPostIdeasPrompt = (topic) => `
Generate a list of 5 blog post ideas related  "${topic}".

For Each blog post idea , return:
- a title
- a 2-line description about the post
- 3 relevant tags
-the tone  (e.g.,technical,casual, beginner-friendly etc.)

Return the result as an array of JSON objects in this format:
[
    {
        "title": "",
        "description": "",
        "tags": ["", "", ""],
        "tone": ""
    },
]
Important: Do NOT add any extra test outside the JSON  format. Only return valid JSON.
`;

export const generateReplyPrompt = (author, content) => {
    const authorName = author?.name || "User";
    return `You're replying to a comment by ${authorName}. The comment says:
    "${content}"
    Write a thoughtful, concise and relevant short reply to this comment.`;
}

export const blogSummaryPrompt = (blogContent) => `
You are an AI assistant that summarizes blog posts.

Instructions:
-- Read the blog post content below.
-- Generate a short, catchy, SEO-friendly title (max 12 words).
-- Write a clear, engaging summary of about 300 words.
-- At the end of the summary, add a markdown section titled **## What You’ll Learn**.
-- Under that heading, list 3–5 key takeaways or skills the reader will learn in **bullet points** using markdown.

Return the result in **valid JSON** with the following structure:
{
  "title": "Short SEO-friendly title",
  "summary": "300-word summary with a markdown section for What You'll Learn"
}

Only return valid JSON. Do not include markdown or code blocks around the JSON.

Blog Post Content:
${blogContent}
`;
