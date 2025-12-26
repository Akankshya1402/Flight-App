package com.flightapp.apigateway.security;

import com.flightapp.apigateway.model.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        // ✅ Allow CORS preflight
        if (method == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        // 1️⃣ Public endpoints (no JWT required)
        if (isPublicEndpoint(path, method)) {
            return chain.filter(exchange);
        }

        // 2️⃣ Read Authorization header
        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }

        String token = authHeader.substring(7);

        // 3️⃣ Validate JWT
        if (!jwtUtil.isTokenValid(token)) {
            return unauthorized(exchange);
        }

        String email = jwtUtil.getEmail(token);
        List<String> roles = jwtUtil.getRoles(token);

        // 4️⃣ Authorize based on role + path
        if (!isAuthorized(path, method, roles)) {
            return forbidden(exchange);
        }

        // 5️⃣ Forward user info to downstream services
        ServerWebExchange mutatedExchange = exchange.mutate()
                .request(builder -> builder
                        .header("X-User-Email", email)
                        .header("X-User-Roles", String.join(",", roles)))
                .build();

        return chain.filter(mutatedExchange);
    }

    // =======================
    // PUBLIC ENDPOINTS
    // =======================
    private boolean isPublicEndpoint(String path, HttpMethod method) {

        if (path.startsWith("/auth/")) {
            return true;
        }

        if (path.equals("/api/v1.0/flight/search") && method == HttpMethod.POST) {
            return true;
        }

        if (path.equals("/api/v1.0/flight/airline/all") && method == HttpMethod.GET) {
            return true;
        }

        if (path.matches("^/api/v1.0/flight/\\d+$") && method == HttpMethod.GET) {
            return true;
        }

        return false;
    }

    // =======================
    // AUTHORIZATION LOGIC
    // =======================
    private boolean isAuthorized(String path, HttpMethod method, List<String> roles) {

        boolean isAdmin = roles.contains(UserRole.ROLE_ADMIN.name());
        boolean isUser = roles.contains(UserRole.ROLE_USER.name());

        // 🔒 ADMIN ONLY APIs (HARD BLOCK)
        if (path.contains("/airline") || path.contains("/inventory")) {
            return isAdmin;
        }

        // Booking APIs (USER + ADMIN)
        if (path.startsWith("/api/v1.0/flight/booking")
                || path.startsWith("/api/v1.0/flight/ticket")) {
            return isUser || isAdmin;
        }

        // Default: authenticated users only
        return isUser || isAdmin;
    }

    // =======================
    // RESPONSES
    // =======================
    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    private Mono<Void> forbidden(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return -1; // run early
    }
}
