import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from "@google/generative-ai";

import { blogPostIdeasPrompt, generateReplyPrompt, blogSummaryPrompt }
    from '../utils/prompts.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc Generate a blog post content from title
// @route POST /api/ai/generate
// @access Private
export const generateBlogPost = asyncHandler(async (req, res) => {
    const { title, tone } = req.body;
    if (!title || !tone) {
        res.status(500);
        throw new Error('Please provide a title and tone for the blog post');
    }
    const prompt = `Write a markdown-formatted blog post titled "${title}". Use a ${tone} tone.
    Include an introduction, subheadings,code examples if relevant  and a conclusion. Ensure the content is engaging and informative.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    res.status(200).json({
        success: true,
        message: 'Blog post generated successfully',
        rawText
    });
});

// @desc Generate blog post ideas
// @route POST /api/ai/generate-ideas
// @access Private
export const generatedBlogPostIdeas = asyncHandler(async (req, res) => {
    const { topics } = req.body;
    if (!topics || topics.length === 0) {
        res.status(500);
        throw new Error('Please provide topics for the comment reply');
    }
    const prompt = blogPostIdeasPrompt(topics);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const result = await model.generateContent(prompt);

    const response = result.response;

    const rawText = response.text();
    //Clean it: REmove ``` JSON and  ``` from beginning and end
    const cleanedText = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
    //Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
});

// @desc Generate a comment reply
// @route POST /api/ai/generate-reply
// @access Private
export const generateCommentReply = asyncHandler(async (req, res) => {
    const { author, content } = req.body;
    if (!content) {
        res.status(500);
        throw new Error('Please provide author and content for the comment reply');
    }
    const prompt = generateReplyPrompt(author, content);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    res.status(200).json(rawText);
});

// @desc Generate a blog post summary
// @route POST /api/ai/generate-summary
// @access Public
export const generatePostSummary = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) {
        res.status(500);
        throw new Error('Please provide content for the blog post summary');
    }
    const prompt = blogSummaryPrompt(content);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    // Clean it: Remove ``` JSON and  ``` from beginning and end
    const cleanedText = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
    // Now safe to parse
    const data = JSON.parse(cleanedText);

    return res.status(200).json(data)
});