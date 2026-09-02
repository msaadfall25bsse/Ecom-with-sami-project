import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

export const adminCurriculumRouter = Router();

// All curriculum management endpoints require Admin authentication
adminCurriculumRouter.use(requireAdmin);

/**
 * 1. GET /api/admin/curriculum
 * Fetch entire course curriculum with modules & lessons
 */
const handleGetCurriculum = (_req: Request, res: Response) => {
  try {
    const modules = db.prepare('SELECT * FROM modules ORDER BY sort_order ASC').all() as any[];

    const curriculum = modules.map(m => {
      const lessons = db.prepare(`
        SELECT * FROM lessons 
        WHERE module_id = ? 
        ORDER BY sort_order ASC
      `).all(m.id) as any[];

      return {
        ...m,
        lessons
      };
    });

    const totalLessons = (db.prepare('SELECT count(*) as total FROM lessons').get() as any).total || 0;

    return res.json({
      success: true,
      modules: curriculum,
      stats: {
        totalModules: modules.length,
        totalLessons
      }
    });
  } catch (err: any) {
    console.error('Error fetching admin curriculum:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

adminCurriculumRouter.get('/', handleGetCurriculum);
adminCurriculumRouter.get('/modules', handleGetCurriculum);

/**
 * 2. POST /api/admin/modules
 * Create a new module
 */
adminCurriculumRouter.post('/modules', (req: Request, res: Response) => {
  try {
    const { title, module_number, description, sort_order } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Module title is required' });
    }

    // Auto calculate module number & sort order if not provided
    const lastModule = db.prepare('SELECT max(sort_order) as maxOrder, count(*) as count FROM modules').get() as any;
    const nextOrder = sort_order !== undefined ? Number(sort_order) : (lastModule.maxOrder || 0) + 1;
    const nextNum = module_number || String(lastModule.count + 1).padStart(2, '0');

    const result = db.prepare(`
      INSERT INTO modules (course_id, module_number, title, description, sort_order)
      VALUES (1, ?, ?, ?, ?)
    `).run(nextNum, title.trim(), description ? description.trim() : '', nextOrder);

    return res.json({
      success: true,
      message: 'Module created successfully',
      id: result.lastInsertRowid
    });
  } catch (err: any) {
    console.error('Error creating module:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 3. PUT /api/admin/modules/:id
 * Update an existing module
 */
adminCurriculumRouter.put('/modules/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, module_number, description, sort_order } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Module title is required' });
    }

    const result = db.prepare(`
      UPDATE modules
      SET title = ?, module_number = COALESCE(?, module_number), description = ?, sort_order = COALESCE(?, sort_order)
      WHERE id = ?
    `).run(title.trim(), module_number || null, description ? description.trim() : '', sort_order !== undefined ? Number(sort_order) : null, id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    return res.json({ success: true, message: 'Module updated successfully' });
  } catch (err: any) {
    console.error('Error updating module:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 4. DELETE /api/admin/modules/:id
 * Delete a module and all associated lessons
 */
adminCurriculumRouter.delete('/modules/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete lessons first
    db.prepare('DELETE FROM lessons WHERE module_id = ?').run(id);
    const result = db.prepare('DELETE FROM modules WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    return res.json({ success: true, message: 'Module and all its lessons deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting module:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 5. POST /api/admin/lessons
 * Create a new lesson inside a module
 */
adminCurriculumRouter.post('/lessons', (req: Request, res: Response) => {
  try {
    const {
      module_id,
      title,
      description,
      video_type = 'bunny',
      bunny_video_id,
      vdocipher_id,
      duration = '15:00',
      attachment_path,
      notes,
      sort_order,
      is_preview = 0
    } = req.body;

    if (!module_id || !title) {
      return res.status(400).json({ success: false, message: 'Module ID and Lesson Title are required' });
    }

    // Auto sort order
    const lastLesson = db.prepare('SELECT max(sort_order) as maxOrder FROM lessons WHERE module_id = ?').get(module_id) as any;
    const nextOrder = sort_order !== undefined ? Number(sort_order) : (lastLesson.maxOrder || 0) + 1;

    const result = db.prepare(`
      INSERT INTO lessons (
        module_id, title, description, video_type, bunny_video_id, vdocipher_id,
        duration, attachment_path, notes, sort_order, is_preview
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      module_id,
      title.trim(),
      description ? description.trim() : '',
      video_type,
      bunny_video_id ? bunny_video_id.trim() : '',
      vdocipher_id ? vdocipher_id.trim() : '',
      duration ? duration.trim() : '15:00',
      attachment_path ? attachment_path.trim() : null,
      notes ? notes.trim() : '',
      nextOrder,
      is_preview ? 1 : 0
    );

    return res.json({
      success: true,
      message: 'Lesson created successfully',
      id: result.lastInsertRowid
    });
  } catch (err: any) {
    console.error('Error creating lesson:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 6. PUT /api/admin/lessons/:id
 * Update an existing lesson
 */
adminCurriculumRouter.put('/lessons/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      module_id,
      title,
      description,
      video_type,
      bunny_video_id,
      vdocipher_id,
      duration,
      attachment_path,
      notes,
      sort_order,
      is_preview
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Lesson title is required' });
    }

    const result = db.prepare(`
      UPDATE lessons
      SET module_id = COALESCE(?, module_id),
          title = ?,
          description = ?,
          video_type = COALESCE(?, video_type),
          bunny_video_id = ?,
          vdocipher_id = ?,
          duration = ?,
          attachment_path = ?,
          notes = ?,
          sort_order = COALESCE(?, sort_order),
          is_preview = COALESCE(?, is_preview)
      WHERE id = ?
    `).run(
      module_id || null,
      title.trim(),
      description ? description.trim() : '',
      video_type || null,
      bunny_video_id ? bunny_video_id.trim() : '',
      vdocipher_id ? vdocipher_id.trim() : '',
      duration ? duration.trim() : '15:00',
      attachment_path || null,
      notes ? notes.trim() : '',
      sort_order !== undefined ? Number(sort_order) : null,
      is_preview !== undefined ? (is_preview ? 1 : 0) : null,
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    return res.json({ success: true, message: 'Lesson updated successfully' });
  } catch (err: any) {
    console.error('Error updating lesson:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 7. DELETE /api/admin/lessons/:id
 * Delete a single lesson
 */
adminCurriculumRouter.delete('/lessons/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM user_progress WHERE lesson_id = ?').run(id);
    const result = db.prepare('DELETE FROM lessons WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    return res.json({ success: true, message: 'Lesson deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting lesson:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
