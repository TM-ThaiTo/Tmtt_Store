package com.trinhminhthaito.backend_springboot.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Value("${key_public}")
	private RSAPublicKey publicKey;

	@Value("${key_private}")
	private RSAPrivateKey privateKey;

	@Bean
	@Order(1)
	public SecurityFilterChain securityFilterChain(HttpSecurity http, HttpSecurity httpSecurity) throws Exception {
		http
				.authorizeRequests(authorize -> authorize
				// swagger
				.requestMatchers(HttpMethod.GET, "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()

				// account
				.requestMatchers(HttpMethod.POST, "/api/v1/account/refresh").permitAll()
				.requestMatchers(HttpMethod.POST, "/api/v1/account/signup").permitAll()
				.requestMatchers(HttpMethod.POST, "/api/v1/account/login").permitAll()
				.requestMatchers(HttpMethod.POST, "/api/v1/account/sendmail").permitAll()
				.requestMatchers(HttpMethod.POST, "/api/v1/account/forgot").permitAll()

				// product
				.requestMatchers(HttpMethod.GET, "/api/v1/product/one").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/v1/product/type").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/v1/product/page").permitAll()

				// address provinces
				.requestMatchers(HttpMethod.GET, "/api/v1/address/all").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/v1/address/provinces").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/v1/address/districts").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/v1/address/communes").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/v1/address/delivery").permitAll()

				// comment
				.requestMatchers(HttpMethod.POST, "/api/v1/comment/create").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/v1/comment/read").permitAll()

				.anyRequest()
				.authenticated());

		http.oauth2ResourceServer(oauth2 ->
				oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder()))
		);
		http.csrf(AbstractHttpConfigurer::disable);
		return http.build();
	}

	@Bean
	public JwtDecoder jwtDecoder() {
		return NimbusJwtDecoder.withPublicKey(publicKey).build();
	}

	@Bean
	public JwtEncoder jwtEncoder() {
		JWK jwk = new RSAKey.Builder(publicKey).privateKey(privateKey).build();
		var jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
		return new NimbusJwtEncoder(jwks);
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
