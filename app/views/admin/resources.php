
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold">LMS Resources & Announcements</h2>
</div>

<div class="row">
    <!-- Announcement Section -->
    <div class="col-12 mb-4">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
                <h5 class="mb-0 fw-bold">Dashboard Announcement</h5>
            </div>
            <div class="card-body">
                <form action="<?= BASE_URL ?>/admin/updateSettings" method="POST">
                    <div class="mb-3">
                        <label class="form-label">Announcement Text</label>
                        <textarea class="form-control" name="announcement_text" rows="3"><?= htmlspecialchars($data["announcement_text"]) ?></textarea>
                        <small class="text-muted">This text appears at the top of the student dashboard. Leave empty to hide.</small>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Announcement</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Download Center Section -->
    <div class="col-md-6 mb-4">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold">Download Center</h5>
                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addDownloadModal">Add Download</button>
            </div>
            <div class="card-body p-0">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Title</th>
                            <th>Sort</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if(empty($data["downloads"])): ?>
                        <tr><td colspan="3" class="text-center py-3 text-muted">No downloads found.</td></tr>
                        <?php else: foreach($data["downloads"] as $dl): ?>
                        <tr>
                            <td>
                                <div class="fw-bold"><?= htmlspecialchars($dl["title"]) ?></div>
                                <div class="small text-muted"><?= htmlspecialchars(substr($dl["description"], 0, 30)) ?>...</div>
                            </td>
                            <td><?= $dl["sort_order"] ?></td>
                            <td class="text-end">
                                <a href="<?= BASE_URL ?>/admin/deleteDownload/<?= $dl["id"] ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this download?')"><i class="bi bi-trash"></i></a>
                            </td>
                        </tr>
                        <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Important Links Section -->
    <div class="col-md-6 mb-4">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold">Important Links</h5>
                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addLinkModal">Add Link</button>
            </div>
            <div class="card-body p-0">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Title & URL</th>
                            <th>Sort</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if(empty($data["links"])): ?>
                        <tr><td colspan="3" class="text-center py-3 text-muted">No links found.</td></tr>
                        <?php else: foreach($data["links"] as $link): ?>
                        <tr>
                            <td>
                                <div class="fw-bold"><?= htmlspecialchars($link["title"]) ?></div>
                                <a href="<?= htmlspecialchars($link["url"]) ?>" target="_blank" class="small"><?= htmlspecialchars($link["url"]) ?></a>
                            </td>
                            <td><?= $link["sort_order"] ?></td>
                            <td class="text-end">
                                <a href="<?= BASE_URL ?>/admin/deleteLink/<?= $link["id"] ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this link?')"><i class="bi bi-trash"></i></a>
                            </td>
                        </tr>
                        <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Add Download Modal -->
<div class="modal fade" id="addDownloadModal" tabindex="-1">
    <div class="modal-dialog">
        <form action="<?= BASE_URL ?>/admin/createDownload" method="POST" enctype="multipart/form-data" class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add New Download</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input type="text" name="title" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Description (Optional)</label>
                    <textarea name="description" class="form-control" rows="2"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">File (ZIP/PDF/etc)</label>
                    <input type="file" name="file" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Sort Order</label>
                    <input type="number" name="sort_order" class="form-control" value="0">
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary w-100">Upload & Save</button>
            </div>
        </form>
    </div>
</div>

<!-- Add Link Modal -->
<div class="modal fade" id="addLinkModal" tabindex="-1">
    <div class="modal-dialog">
        <form action="<?= BASE_URL ?>/admin/createLink" method="POST" class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Important Link</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Link Title</label>
                    <input type="text" name="title" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">URL</label>
                    <input type="url" name="url" class="form-control" required placeholder="https://...">
                </div>
                <div class="mb-3">
                    <label class="form-label">Description (Optional)</label>
                    <textarea name="description" class="form-control" rows="2"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Sort Order</label>
                    <input type="number" name="sort_order" class="form-control" value="0">
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary w-100">Save Link</button>
            </div>
        </form>
    </div>
</div>

