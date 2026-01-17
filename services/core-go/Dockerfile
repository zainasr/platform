# ---------- build stage ----------
    FROM golang:1.23-alpine AS build

    WORKDIR /app
    
    RUN adduser -D -g '' appuser
    
    COPY go.mod ./
    RUN go mod download
    
    COPY . .
    
    RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
        go build -o server ./cmd/server
    
    # ---------- runtime stage ----------
    FROM gcr.io/distroless/base-debian12
    
    WORKDIR /app
    
    COPY --from=build /app/server /app/server
    
    USER nonroot:nonroot
    
    EXPOSE 8080
    
    ENTRYPOINT ["/app/server"]
    