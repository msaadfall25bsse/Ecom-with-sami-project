<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title><?= isset($data['title']) ? htmlspecialchars($data['title']) : 'ECOM WITH SAMI' ?></title>
    <style>
        html, body {
            overflow-x: clip;
            width: 100%;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        input, textarea, select {
            -webkit-user-select: auto !important;
            user-select: auto !important;
        }
        .allow-select {
            -webkit-user-select: text !important;
            user-select: text !important;
        }
    </style>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- AOS Animations -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/assets/css/style.css?v=<?= time() ?>">
    <?php if(!empty($settings['tracking_head'])) echo $settings['tracking_head']; ?>
</head>
<body>
    <?php if(!empty($settings['tracking_body'])) echo $settings['tracking_body']; ?>
    <div class="background-glow"></div>
    <!-- Announcement Bar Header -->
    <div class="fixed-top" style="z-index: 99999;">
        <div class="bg-success py-2 fw-bold text-white fs-6 shadow-sm marquee-container" style="background-color: #10b981 !important;">
            <div class="marquee-text" style="white-space: nowrap;">
                <?= str_replace('|', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;★&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', htmlspecialchars($settings['announcement_text'] ?? 'Fee Locked at PKR 3,900 | Students Trained 9,700+ | UAE & KSA Dropshipping Training | Lifetime Mentorship Included | Product Hunting Without Paid Tools | Real Student Video Reviews Available')) ?>
            </div>
        </div>
    </div>
    <!-- Spacer for fixed header -->
    <div style="height: 40px;"></div>

    <!-- Main Content -->
    <main>
        <?php require_once '../app/views/' . $view . '.php'; ?>
    </main>

    <!-- Footer -->
    <footer class="footer mt-5 pt-5 pb-3">
        <div class="container text-center">
            <p>&copy; <?= date('Y') ?> ECOM WITH SAMI. All rights reserved.</p>
        </div>
    </footer>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- AOS JS -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            duration: 800,
            once: true
        });
    </script>
    <script src="<?= BASE_URL ?>/public/assets/js/events.js"></script>


</body>
</html>
