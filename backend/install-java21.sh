#!/bin/bash
echo "Installing Java 21 using Homebrew..."
brew install openjdk@21
echo "Creating symlink..."
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
echo "✅ Java 21 installed!"
echo ""
echo "Verify installation:"
/usr/libexec/java_home -V
