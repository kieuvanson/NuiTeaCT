# -------- Build stage --------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files first for better layer caching
COPY NuiTeaCT/Nui_Tea.sln ./NuiTeaCT/
COPY NuiTeaCT/NuiTeaApi/NuiTeaApi.csproj ./NuiTeaCT/NuiTeaApi/

# Restore
RUN dotnet restore ./NuiTeaCT/NuiTeaApi/NuiTeaApi.csproj

# Copy the rest of the source
COPY . .

# Publish
RUN dotnet publish ./NuiTeaCT/NuiTeaApi/NuiTeaApi.csproj -c Release -o /app/out --no-restore

# -------- Runtime stage --------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Railway (and many PaaS) set PORT env. Bind Kestrel to it.
ENV ASPNETCORE_URLS=http://+:${PORT}

# Copy published output
COPY --from=build /app/out .

# Optional: expose a default port for local runs
EXPOSE 8080

ENTRYPOINT ["dotnet", "NuiTeaApi.dll"]
