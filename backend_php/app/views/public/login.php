<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($data['title']) ? htmlspecialchars($data['title']) : 'Student Login' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .login-card { max-width: 400px; width: 100%; border-radius: 12px; border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
        .login-card .card-header { background-color: white; border-bottom: none; text-align: center; padding-top: 30px; }
        .login-card .card-body { padding: 30px; }
        .btn-custom { background-color: #00a2e8; color: white; font-weight: bold; border-radius: 8px; padding: 12px; }
        .btn-custom:hover { background-color: #008ecc; color: white; }
    </style>
</head>
<body>

    <div class="card login-card">
        <div class="card-header">
            <h3 class="fw-black" style="font-style: italic;">ECOMM<span style="color: #00a2e8;">STORY</span></h3>
            <p class="text-muted small mt-2">Sign in to your learning dashboard</p>
        </div>
        <div class="card-body">
            <?php if(isset($data['error']) && $data['error']): ?>
                <div class="alert alert-danger text-center small"><?= htmlspecialchars($data['error']) ?></div>
            <?php endif; ?>
            
            <form method="POST" action="<?= BASE_URL ?>/auth/login">
                <div class="mb-3">
                    <label class="form-label text-secondary fw-bold small">Email Address</label>
                    <input type="email" name="email" class="form-control form-control-lg bg-light" required placeholder="Enter your email">
                </div>
                <div class="mb-4">
                    <label class="form-label text-secondary fw-bold small">Password</label>
                    <input type="password" name="password" class="form-control form-control-lg bg-light" required placeholder="Enter your password">
                </div>
                <button type="submit" class="btn btn-custom w-100">LOG IN</button>
            </form>
            
            <div class="text-center mt-4">
                <a href="<?= BASE_URL ?>" class="text-decoration-none text-muted small">← Back to Website</a>
            </div>
        </div>
    </div>

</body>
</html>
