package logger

import (
	"encoding/json"
	"log"
	"time"
)

func Info(message string, fields map[string]string) {
	entry := map[string]string{
		"level":     "info",
		"service":   "core-go",
		"timestamp": time.Now().Format(time.RFC3339),
		"message":   message,
	}

	for k, v := range fields {
		entry[k] = v
	}

	b, _ := json.Marshal(entry)
	log.Println(string(b))
}

