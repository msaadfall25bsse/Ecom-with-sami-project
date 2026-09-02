<div class="text-center mb-4">
    <h2 class="fw-bold text-white">Admin Login</h2>
</div>
<?php if(isset($data['error'])): ?>
    <div class="alert alert-danger"><?= htmlspecialchars($data['error']) ?></div>
<?php endif; ?>
<form action="<?= BASE_URL ?>/admin/login" method="POST">
    <div class="mb-3">
        <label class="form-label text-muted">Username</label>
        <input type="text" name="username" class="form-control bg-dark text-white border-secondary" required>
    </div>
    <div class="mb-4">
        <label class="form-label text-muted">Password</label>
        <input type="password" name="password" class="form-control bg-dark text-white border-secondary" required>
    </div>
    <button type="submit" class="btn btn-primary w-100">Login</button>
</form>
