<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title) ?></title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#ff9800',
                        dark: '#121212',
                        darker: '#0a0a0a'
                    },
                    fontFamily: {
                        sans: ['Montserrat', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #0a0a0a;
            color: #ffffff;
        }
        .gradient-text {
            background: linear-gradient(90deg, #ff9800, #ffb74d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .app-card {
            background: #1a1a1a;
            border: 1px solid #333;
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .app-card:hover {
            transform: translateY(-5px);
            border-color: #ff9800;
        }
    </style>
</head>
<body class="antialiased min-h-screen flex flex-col items-center justify-center py-12 px-4">

    <div class="max-w-4xl w-full">
        <!-- Logo & Header -->
        <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">Download <span class="gradient-text">Ecom With Sami</span> App</h1>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">Access your premium ecommerce training from anywhere. Download our dedicated application for your preferred platform.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            
            <!-- Android Card -->
            <div class="app-card rounded-2xl p-8 text-center shadow-xl">
                <div class="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <i class="fab fa-android text-4xl text-green-500"></i>
                </div>
                <h2 class="text-2xl font-bold mb-3">Android App</h2>
                <p class="text-gray-400 mb-8 text-sm">Download the latest APK for your Android smartphone or tablet.</p>
                
                <a href="<?= htmlspecialchars($settings['android_update_url'] ?? 'public/WithSamiLMS_v11.apk') ?>" download class="inline-flex items-center justify-center w-full py-4 px-6 bg-primary text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors gap-2 text-lg uppercase tracking-wide">
                    <i class="fas fa-download"></i> Download APK
                </a>
            </div>

            <!-- Windows Card -->
            <div class="app-card rounded-2xl p-8 text-center shadow-xl">
                <div class="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                    <i class="fab fa-windows text-4xl text-blue-500"></i>
                </div>
                <h2 class="text-2xl font-bold mb-3">Windows App</h2>
                <p class="text-gray-400 mb-8 text-sm">Download the executable for your Windows desktop or laptop.</p>
                
                <a href="<?= htmlspecialchars($settings['windows_update_url'] ?? 'public/WithSamiLMS_Windows.exe') ?>" download class="inline-flex items-center justify-center w-full py-4 px-6 bg-[#0078d7] text-white font-bold rounded-xl hover:bg-blue-600 transition-colors gap-2 text-lg uppercase tracking-wide">
                    <i class="fas fa-download"></i> Download EXE
                </a>
            </div>
            
        </div>

        <div class="text-center mt-12 text-gray-500 text-sm">
            <p>For support, please contact your instructor.</p>
            <a href="<?= BASE_URL ?>" class="text-primary hover:underline mt-2 inline-block"><i class="fas fa-arrow-left mr-1"></i> Back to Homepage</a>
        </div>
    </div>

</body>
</html>
