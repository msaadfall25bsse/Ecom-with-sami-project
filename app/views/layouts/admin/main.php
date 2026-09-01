<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($data['title']) ? htmlspecialchars($data['title']) : 'Admin Dashboard' ?></title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/assets/css/style.css">
    <style>
        .sidebar { min-height: 100vh; background-color: var(--card-bg); border-right: 1px solid rgba(255,255,255,0.05); }
        .sidebar a { color: var(--muted-color); text-decoration: none; padding: 10px 20px; display: block; border-left: 3px solid transparent; }
        .sidebar a:hover, .sidebar a.active { color: var(--primary-color); background-color: rgba(37,99,235,0.1); border-left-color: var(--primary-color); }
        .main-content { padding: 20px; flex-grow: 1; }
    </style>
</head>
<body class="d-flex">
    <div class="sidebar d-flex flex-column flex-shrink-0" style="width: 250px; z-index: 1000; position: relative;">
        <h3 class="text-white p-3 border-bottom border-secondary mb-0">Admin Panel</h3>
        <a href="<?= BASE_URL ?>/admin/dashboard" class="<?= $view == 'admin/dashboard' ? 'active' : '' ?>">Dashboard</a>
        <a href="<?= BASE_URL ?>/admin/leads" class="<?= $view == 'admin/leads' ? 'active' : '' ?>">Leads</a>
        <a href="<?= BASE_URL ?>/admin/orders" class="<?= $view == 'admin/orders' ? 'active' : '' ?>">Orders</a>
        <a href="<?= BASE_URL ?>/admin/modules" class="<?= $view == 'admin/modules' ? 'active' : '' ?>">LMS Modules</a>
        <a href="<?= BASE_URL ?>/admin/lessons" class="<?= $view == 'admin/lessons' ? 'active' : '' ?>">LMS Lessons</a>
        <a href="<?= BASE_URL ?>/admin/resources" class="<?= $view == 'admin/resources' ? 'active' : '' ?>">LMS Resources</a>
        <a href="<?= BASE_URL ?>/admin/blogs" class="<?= $view == 'admin/blogs' ? 'active' : '' ?>">Blogs</a>
        <a href="<?= BASE_URL ?>/admin/testimonials" class="<?= $view == 'admin/testimonials' ? 'active' : '' ?>">Testimonials</a>
        <a href="<?= BASE_URL ?>/admin/faq" class="<?= $view == 'admin/faq' ? 'active' : '' ?>">FAQ</a>
        <a href="<?= BASE_URL ?>/admin/settings" class="<?= $view == 'admin/settings' ? 'active' : '' ?>">Website Settings</a>
        <a href="<?= BASE_URL ?>/admin/pixels" class="<?= $view == 'admin/pixels' ? 'active' : '' ?>">Pixel Settings</a>
        <a href="<?= BASE_URL ?>/admin/logout" class="mt-auto border-top border-secondary text-danger">Logout</a>
    </div>
    <div class="main-content" style="width: calc(100% - 250px); overflow-x: hidden;">
        <?php require_once '../app/views/' . $view . '.php'; ?>
    </div>
    
    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
