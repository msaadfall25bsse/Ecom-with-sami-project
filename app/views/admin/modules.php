<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Manage LMS Modules</h2>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModuleModal">Add New Module</button>
</div>

<div class="card shadow-sm">
    <div class="card-body">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Sort Order</th>
                    <th>Module Title</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if(isset($data['modules']) && count($data['modules']) > 0): ?>
                    <?php foreach($data['modules'] as $module): ?>
                    <tr>
                        <td><?= htmlspecialchars($module['sort_order']) ?></td>
                        <td><strong><?= htmlspecialchars($module['title']) ?></strong></td>
                        <td><?= htmlspecialchars(substr($module['description'], 0, 50)) ?>...</td>
                        <td><?= htmlspecialchars($module['created_at']) ?></td>
                        <td>
                            <a href="<?= BASE_URL ?>/admin/lessons/<?= $module['id'] ?>" class="btn btn-sm btn-info text-white">Manage Lessons</a>
                            <button class="btn btn-sm btn-primary text-white" data-bs-toggle="modal" data-bs-target="#editModuleModal<?= $module['id'] ?>">Edit</button>
                            <a href="<?= BASE_URL ?>/admin/deleteModule/<?= $module['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this module and all its lessons?');">Delete</a>

                            <!-- Edit Module Modal -->
                            <div class="modal fade" id="editModuleModal<?= $module['id'] ?>" tabindex="-1">
                                <div class="modal-dialog">
                                    <form method="POST" action="<?= BASE_URL ?>/admin/updateModule" class="modal-content bg-dark text-white text-start" style="border: 1px solid #444;">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Edit Module</h5>
                                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div class="modal-body">
                                            <input type="hidden" name="module_id" value="<?= $module['id'] ?>">
                                            <div class="mb-3">
                                                <label class="form-label">Module Title</label>
                                                <input type="text" name="title" class="form-control" required value="<?= htmlspecialchars($module['title']) ?>">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Description (Optional)</label>
                                                <textarea name="description" class="form-control" rows="3"><?= htmlspecialchars($module['description'] ?? '') ?></textarea>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Sort Order (0, 1, 2...)</label>
                                                <input type="number" name="sort_order" class="form-control" value="<?= htmlspecialchars($module['sort_order']) ?>">
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-primary">Save Changes</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr><td colspan="5" class="text-center">No modules found. Create one to get started!</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Create Module Modal -->
<div class="modal fade" id="createModuleModal" tabindex="-1">
    <div class="modal-dialog">
        <form method="POST" action="<?= BASE_URL ?>/admin/createModule" class="modal-content bg-dark text-white" style="border: 1px solid #444;">
            <div class="modal-header">
                <h5 class="modal-title">Create New Module</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Module Title</label>
                    <input type="text" name="title" class="form-control" required placeholder="e.g. Module 1: Mindset">
                </div>
                <div class="mb-3">
                    <label class="form-label">Description (Optional)</label>
                    <textarea name="description" class="form-control" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Sort Order (0, 1, 2...)</label>
                    <input type="number" name="sort_order" class="form-control" value="0">
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary">Save Module</button>
            </div>
        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
