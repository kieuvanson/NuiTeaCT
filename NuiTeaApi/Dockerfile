# -------- Build stage --------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project file and restore
COPY NuiTeaApi.csproj ./
RUN dotnet restore ./NuiTeaApi.csproj

# Copy everything and publish
COPY . .
RUN dotnet publish ./NuiTeaApi.csproj -c Release -o /app/out --no-restore

# -------- Runtime stage --------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:${PORT}

COPY --from=build /app/out .

EXPOSE 8080

ENTRYPOINT ["dotnet", "NuiTeaApi.dll"]
