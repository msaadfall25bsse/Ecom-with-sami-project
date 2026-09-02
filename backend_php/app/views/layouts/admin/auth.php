<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($data['title']) ? htmlspecialchars($data['title']) : 'Admin Auth' ?></title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/assets/css/style.css">
    <style>
        body { display: flex; align-items: center; justify-content: center; height: 100vh; background-color: var(--bg-color); }
        .auth-card { width: 100%; max-width: 400px; padding: 2rem; }
    </style>
</head>
<body>
    <div class="auth-card card shadow">
        <?php require_once '../app/views/' . $view . '.php'; ?>
    </div>
</body>
</html>
