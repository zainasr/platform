package middleware

import (
	"net/http"
	"time"
	"core-go/internal/metrics"
)

type statusRecorder struct {
	http.ResponseWriter
	status int
	wroteHeader bool
}

func (r *statusRecorder) WriteHeader(code int) {
	if !r.wroteHeader {
		r.status = code
		r.wroteHeader = true
		r.ResponseWriter.WriteHeader(code)
	}
}

func (r *statusRecorder) Write(b []byte) (int, error) {
	if !r.wroteHeader {
		r.WriteHeader(http.StatusOK)
	}
	return r.ResponseWriter.Write(b)
}

func Metrics(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		recorder := &statusRecorder{
			ResponseWriter: w,
			status:         200,
			wroteHeader:    false,
		}

		next.ServeHTTP(recorder, r)

		duration := time.Since(start).Seconds()

		metrics.HttpRequestsTotal.WithLabelValues(
			r.Method,
			r.URL.Path,
			http.StatusText(recorder.status),
		).Inc()

		metrics.HttpRequestDuration.WithLabelValues(
			r.Method,
			r.URL.Path,
		).Observe(duration)
	})
}
