package info

import (
	"encoding/json"
	"net/http"
	"os"
	"core-go/internal/logger"
)

type Response struct {
	Service string `json:"service"`
	Env     string `json:"env"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	env := os.Getenv("ENV")
	if env == "" {
		env = "unknown"
	}

	logger.Info("core-go info request", map[string]string{
		"request_id": r.Header.Get("X-Request-Id"),
	})

	resp := Response{
		Service: "core-go",
		Env:     env,
	}


	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
