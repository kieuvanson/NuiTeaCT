# Sử dụng .NET 8.0 SDK để build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["NuiTeaApi.csproj", "./"]
RUN dotnet restore "NuiTeaApi.csproj"

# Copy source code
COPY . .
RUN dotnet build "NuiTeaApi.csproj" -c Release -o /app/build

# Publish
RUN dotnet publish "NuiTeaApi.csproj" -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080

# Set environment variable for port
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "NuiTeaApi.dll"] 