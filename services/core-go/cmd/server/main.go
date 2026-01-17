package main

import (
	"log"
	"net/http"
	"os"

	"core-go/internal/health"
	"core-go/internal/info"
	"core-go/internal/middleware"
	"core-go/internal/logger"
	"core-go/internal/metrics"
   "github.com/prometheus/client_golang/prometheus/promhttp"

)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	metrics.Register()

	mux := http.NewServeMux()
	mux.HandleFunc("/health", health.Handler)
	mux.HandleFunc("/info", info.Handler)
	mux.Handle("/metrics", promhttp.Handler())
    handler := middleware.RequestID(
		middleware.Metrics(mux),
	)
	

	server := &http.Server{
		Addr:    ":" + port,
		Handler: handler,
	}

	logger.Info("core-go service listening on :%s", map[string]string{
		"port": port,	
	})

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
