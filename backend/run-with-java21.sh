#!/bin/bash
# Script to run Maven with Java 21

export JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.9/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"

echo "Using Java:"
java -version

echo ""
echo "Running: mvn $@"
mvn "$@"
