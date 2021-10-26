# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . .
WORKDIR /app
RUN dotnet build -c Release -o out

# Publish
FROM build AS publish
RUN dotnet publish -c Release -o out

# Build runtime image
CMD ["dotnet", "run"]