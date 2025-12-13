# Hot Reload / Auto-Update Setup Guide

This guide explains how to enable automatic code reloading for the RentMate backend.

## ✅ Already Configured

The project includes **Spring Boot DevTools** which provides:
- Automatic application restart when code changes
- LiveReload support for browser refresh
- Fast restart (only restarts the application context, not the JVM)

## How It Works

### Automatic Restart
When you save changes to Java files in `src/main/java` or configuration files in `src/main/resources`, DevTools will:
1. Detect the change
2. Automatically restart the Spring Boot application
3. Reload only the changed classes (faster than full restart)

### LiveReload
- DevTools includes a LiveReload server on port 35729
- Browser extensions can connect to automatically refresh pages
- Works with frontend development

## Running with Auto-Reload

### Option 1: Maven Command (Recommended)
```bash
cd backend
mvn spring-boot:run
```

DevTools will automatically:
- Watch for file changes
- Restart when needed
- Show restart logs in console

### Option 2: Run from IDE

**IntelliJ IDEA:**
1. Open the project
2. Run `RentMateApplication` (right-click → Run)
3. Enable "Build project automatically":
   - File → Settings → Build, Execution, Deployment → Compiler
   - Check "Build project automatically"
4. Enable "Allow auto-make":
   - File → Settings → Advanced Settings
   - Check "Allow auto-make to start even if developed application is currently running"

**VS Code:**
1. Install "Extension Pack for Java"
2. Open the backend folder
3. Run the application from the Run/Debug panel
4. Changes will auto-reload

**Eclipse:**
1. Right-click project → Properties → Java Build Path
2. Enable "Build automatically"
3. Run the application

## What Triggers Restart

✅ **Triggers Restart:**
- Changes to `.java` files in `src/main/java`
- Changes to `.yml` or `.properties` files in `src/main/resources`
- Changes to templates (if using Thymeleaf, etc.)

❌ **Does NOT Trigger Restart:**
- Changes to test files (`src/test`)
- Changes to static resources (`static/`, `public/`)
- Changes to `.gitignore` or build files

## Performance Tips

1. **Exclude Large Directories:**
   - Already configured to exclude `static/`, `public/`, `templates/`
   - Add more exclusions in `application.yml` if needed

2. **Disable for Production:**
   - DevTools is automatically excluded from production builds
   - No need to remove it from `pom.xml`

3. **Fast Restart:**
   - DevTools uses a "restart classloader" for faster restarts
   - Only restarts the application context, not the full JVM
   - Typically restarts in 1-2 seconds

## Troubleshooting

### Restart Not Working?

1. **Check DevTools is included:**
   ```bash
   mvn dependency:tree | grep devtools
   ```

2. **Verify file watching:**
   - Make sure you're editing files in `src/main/java` or `src/main/resources`
   - Check that files are being saved

3. **Check logs:**
   - Look for "Restarting due to..." messages in console
   - Check for errors preventing restart

4. **Manual restart:**
   - Press `Ctrl+C` to stop
   - Run `mvn spring-boot:run` again

### Too Many Restarts?

If you're getting too many restarts:
1. Check `application.yml` for excluded paths
2. Add more exclusions if needed:
   ```yaml
   spring:
     devtools:
       restart:
         exclude: static/**,public/**,templates/**,logs/**
   ```

### IDE Not Auto-Compiling?

**IntelliJ IDEA:**
- File → Settings → Build, Execution, Deployment → Compiler
- Check "Build project automatically"
- Apply changes

**VS Code:**
- Install Java Extension Pack
- Enable "Java: Autobuild" in settings

**Eclipse:**
- Project → Build Automatically (should be checked)

## LiveReload Browser Extension

Install LiveReload extension for automatic browser refresh:
- Chrome: [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggjgedjdllkeiiihfde)
- Firefox: [LiveReload](https://addons.mozilla.org/en-US/firefox/addon/livereload-web-extension/)

Then:
1. Start the backend with `mvn spring-boot:run`
2. Enable the LiveReload extension
3. Open your frontend in the browser
4. Changes will auto-refresh!

## Configuration Files

### application.yml
```yaml
spring:
  devtools:
    restart:
      enabled: true
      additional-paths: src/main/java,src/main/resources
      exclude: static/**,public/**,templates/**
    livereload:
      enabled: true
```

### pom.xml
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

## Best Practices

1. ✅ Keep DevTools in development only (already configured)
2. ✅ Exclude large directories from watching
3. ✅ Use IDE auto-compile for faster feedback
4. ✅ Monitor restart logs to understand what's changing
5. ✅ Use LiveReload for frontend development

## Summary

With DevTools configured:
- ✅ Code changes → Auto restart (1-2 seconds)
- ✅ Config changes → Auto restart
- ✅ Browser → Auto refresh (with LiveReload extension)
- ✅ Fast development cycle

Just run `mvn spring-boot:run` and start coding! 🚀

