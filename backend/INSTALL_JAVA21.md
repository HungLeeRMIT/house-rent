# Installing Java 21 for RentMate Backend

The RentMate backend requires Java 21. Follow these instructions to install it on macOS.

## Option 1: Using Homebrew (Recommended)

```bash
# Install Java 21
brew install openjdk@21

# Create symlink so macOS recognizes it
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk

# Verify installation
/usr/libexec/java_home -V
```

## Option 2: Using SDKMAN

```bash
# Install SDKMAN if you don't have it
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Install Java 21
sdk install java 21.0.1-tem

# Set as default (optional)
sdk default java 21.0.1-tem
```

## Option 3: Manual Installation

1. Download Java 21 from Oracle:
   - Visit: https://www.oracle.com/java/technologies/downloads/#java21
   - Download macOS ARM64 DMG installer
   - Install the package

2. Verify installation:
   ```bash
   /usr/libexec/java_home -V
   java -version
   ```

## After Installation

Once Java 21 is installed, you can:

1. **Use the helper script:**
   ```bash
   cd backend
   ./run-with-java21.sh spring-boot:run
   ```

2. **Set Java 21 as default for this project:**
   ```bash
   export JAVA_HOME=$(/usr/libexec/java_home -v 21)
   cd backend
   mvn spring-boot:run
   ```

3. **Add to your shell profile** (for permanent use):
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile
   export JAVA_HOME=$(/usr/libexec/java_home -v 21)
   ```

## Verify Java Version

```bash
java -version
# Should show: openjdk version "21.x.x"
```

## Troubleshooting

If you still see Java 23 being used:

1. Check available Java versions:
   ```bash
   /usr/libexec/java_home -V
   ```

2. Explicitly set JAVA_HOME:
   ```bash
   export JAVA_HOME=$(/usr/libexec/java_home -v 21)
   ```

3. Verify Maven is using the correct Java:
   ```bash
   mvn -version
   ```

