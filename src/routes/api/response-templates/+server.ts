import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getResponseTemplate, getAllResponseTemplates, updateResponseTemplate, initializeResponseTemplatesTable } from '$lib/db';

/**
 * GET /api/response-templates
 * Fetch response templates
 * 
 * Query params:
 *   - type: 'acceptance' | 'rejection' (optional, fetch specific template)
 *   - all: true (optional, fetch all templates)
 * 
 * Examples:
 *   GET /api/response-templates?type=acceptance
 *   GET /api/response-templates?all=true
 */
export const GET: RequestHandler = async ({ url }) => {
    try {
        await initializeResponseTemplatesTable();
        
        const type = url.searchParams.get('type');
        const all = url.searchParams.get('all');
        
        if (all === 'true') {
            const templates = await getAllResponseTemplates();
            return json({ success: true, templates });
        }
        
        if (type && ['acceptance', 'rejection'].includes(type)) {
            const template = await getResponseTemplate(type as 'acceptance' | 'rejection');
            if (!template) {
                return json({ success: false, error: `Template not found for type: ${type}` }, { status: 404 });
            }
            return json({ success: true, template });
        }
        
        // Default: return both templates
        const templates = await getAllResponseTemplates();
        return json({ success: true, templates });
    } catch (error) {
        console.error('Error fetching response templates:', error);
        return json({ success: false, error: 'Failed to fetch response templates' }, { status: 500 });
    }
};

/**
 * POST /api/response-templates
 * Update a response template
 * 
 * Body:
 * {
 *   type: 'acceptance' | 'rejection',
 *   title: string,
 *   message: string,
 *   nextSteps?: string
 * }
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        if (request.method !== 'POST') {
            return json({ success: false, error: 'Method not allowed' }, { status: 405 });
        }
        
        const body = await request.json();
        const { type, title, message, nextSteps } = body;
        
        if (!type || !['acceptance', 'rejection'].includes(type)) {
            return json({ success: false, error: 'Invalid or missing type (must be acceptance or rejection)' }, { status: 400 });
        }
        
        if (!title || !message) {
            return json({ success: false, error: 'Title and message are required' }, { status: 400 });
        }
        
        await initializeResponseTemplatesTable();
        
        const updatedTemplate = await updateResponseTemplate(
            type as 'acceptance' | 'rejection',
            title,
            message,
            nextSteps || null
        );
        
        if (!updatedTemplate) {
            return json({ success: false, error: 'Failed to update template' }, { status: 500 });
        }
        
        return json({ success: true, template: updatedTemplate });
    } catch (error) {
        console.error('Error updating response template:', error);
        return json({ success: false, error: 'Failed to update response template' }, { status: 500 });
    }
};
