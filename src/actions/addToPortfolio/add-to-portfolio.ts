/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Project } from "@/lib/types";

if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined in the environment variables.");
}

// Helper function to call Groq API
async function callGroqAPI(messages: Array<{ role: string; content: string }>, temperature: number = 0.7) {
  const apiKey = process.env.GROQ_API_KEY;
  const baseUrl = process.env.GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1';
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || '';
}


export async function addToPortfolio(project : Project) {
    if(!project) {
      return { success: false, error: "Project is required." };
    }
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }
    const isProjectAdded = await prisma.project.findUnique({
      where: {
        userId_name: {
          userId: user.id,
          name: project.name,
        }
      },
      select: {
        id: true,
        isAdded: true,
      }
    })

    if(isProjectAdded?.isAdded) {
      return { success: false, error: "Project already exists" };
    };

    const prompt = `I have this html file ${user.htmlFiles}.
If the project '${project.name}' is not in the projects section of my html file, add the following project data to the HTML file:
${JSON.stringify(project)}

Please append this new project into the existing projects section of the HTML file. 
Keep the exact same layout and styling already present in the HTML file, just add the new project card.
Do NOT update or change anything previously in the html file. Just add the new project to the html file in the projects section.

CRITICAL INSTRUCTION: You must return ONLY the completely updated RAW HTML code. DO NOT include any conversational text, explanations, or markdown formatting (no \`\`\`html blocks). Start directly with <!DOCTYPE html> or <html> and end with </html>.
    `;

    const systemPrompt = "You are an automated code editor. Your only function is to output raw, valid HTML. Never include conversational text, pleasantries, or markdown blocks. Just output the code.";

    let updatedHTML = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ], 0.2); // Lower temperature for more deterministic output

    // Fallback: If AI still outputs markdown HTML block, strip it. If there is conversational text before <!DOCTYPE html> or <html>, trim it.
    const htmlBlockRegex = /```(?:html)?\s*([\s\S]*?)```/i;
    const match = updatedHTML.match(htmlBlockRegex);
    if (match) {
      updatedHTML = match[1].trim();
    } else {
      // Find where HTML starts to strip leading conversational text
      const htmlStartIndex = updatedHTML.search(/<!DOCTYPE html>|<html/i);
      if (htmlStartIndex !== -1) {
        updatedHTML = updatedHTML.substring(htmlStartIndex);
      }
    }
    
    console.log("RESPONSED text", updatedHTML);

    // Store repositories in database
    const addedProject = await prisma.project.update({
      where: {
        userId_name: {
          userId: user.id,
          name: project.name,
        }
      },
      data: {
        isAdded: true,
        updatedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        htmlFiles: updatedHTML,
      },
    });

    return {
      success: true,
      projects: addedProject,
    };
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return { success: false, error: "Failed to fetch repositories" };
  }
}