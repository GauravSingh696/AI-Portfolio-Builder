import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const templatesDir = path.join(process.cwd(), 'src', 'templates');
        if (!fs.existsSync(templatesDir)) {
            return NextResponse.json({ templates: [] });
        }

        const files = fs.readdirSync(templatesDir);
        // Find all images (png, jpeg, jpg, webp)
        const imageFiles = files.filter(file => /\.(png|jpe?g|webp)$/i.test(file));

        const templates = imageFiles.map(imageFile => {
            const templateId = imageFile.split('.')[0]; // e.g. "template1"
            const htmlPath = path.join(templatesDir, `${templateId}.html`);

            // Only include it if the corresponding HTML file also exists
            if (!fs.existsSync(htmlPath)) {
                return null;
            }

            const imagePath = path.join(templatesDir, imageFile);
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString('base64');
            const ext = path.extname(imageFile).toLowerCase().substring(1); // e.g. "png"
            const mimeType = ext === 'jpg' ? 'jpeg' : ext; // image/jpeg, image/png

            // Format a nice name
            const numMatch = templateId.match(/\d+/);
            const name = numMatch ? `Template ${numMatch[0]}` : templateId;

            return {
                id: templateId,
                name: name,
                image: `data:image/${mimeType};base64,${base64Image}`,
            };
        }).filter(Boolean).sort((a, b) => {
            // @ts-ignore
            return a.id.localeCompare(b.id, undefined, { numeric: true });
        });

        return NextResponse.json({ templates });
    } catch (error) {
        console.error('Error reading templates:', error);
        return NextResponse.json({ error: 'Failed to read templates' }, { status: 500 });
    }
}
