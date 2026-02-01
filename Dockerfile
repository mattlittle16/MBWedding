# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY MBWedding.Web/MBWedding.Web.csproj MBWedding.Web/
RUN dotnet restore MBWedding.Web/MBWedding.Web.csproj

# Copy source code and build
COPY MBWedding.Web/ MBWedding.Web/
WORKDIR /src/MBWedding.Web
RUN dotnet build -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080

# Copy published app
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/guestbook || exit 1

ENTRYPOINT ["dotnet", "MBWedding.Web.dll"]
