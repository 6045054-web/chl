
@echo off
setlocal
echo ======================================================
echo [成汇数字平台] 国内开发环境一键修复工具
echo ======================================================
echo.

:: 检查当前目录是否有 package.json
if not exist "package.json" (
    echo [错误] 请将此文件放在项目根目录（含有 package.json 的文件夹）运行！
    echo 当前目录: %cd%
    pause
    exit /b
)

echo 1. 正在强制切换为阿里云/淘宝镜像源...
call npm config set registry https://registry.npmmirror.com

echo.
echo 2. 正在清理旧的依赖和缓存 (可能会稍慢，请耐心等待)...
if exist node_modules (
    rd /s /q node_modules
)
if exist package-lock.json (
    del /f /q package-lock.json
)

echo.
echo 3. 正在重新下载核心组件 (强制国内加速模式)...
call npm install --force

echo.
echo 4. 正在编译前端资源...
call npm run build

echo.
echo 5. 正在同步到 Android 工程...
call npx cap sync android

echo.
echo ======================================================
echo [恭喜] 环境修复完成！
echo.
echo 现在请：
echo 1. 回到 Android Studio
echo 2. 点击右侧工具栏顶部的蓝色小象图标 (Sync Project with Gradle Files)
echo 3. 点击绿色三角形运行程序。
echo ======================================================
pause
