package com.trinhminhthaito.backend_springboot.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.util.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Value("${key_public}")
	private RSAPublicKey publicKey;

	@Value("${key_private}")
	private RSAPrivateKey privateKey;

//	@Value("${jwt.signerKey}")
//	private String signerKey;


	public static final String[] PUBLIC_ENDPOINTS = {
			// swagger
			"/swagger-ui/**",
			"/swagger-ui.html",
			"/v3/api-docs/**",

			// account
			"/api/v1/account/logout",
//			"/api/v1/account/auth",

			"/api/v1/account/signup",
			"/api/v1/account/login",
			"/api/v1/account/sendmail",
			"/api/v1/account/forgot",

			// product
			"/api/v1/product/one",
			"/api/v1/product/type",
			"/api/v1/product/page",

			// address
			"/api/v1/address/all",
			"/api/v1/address/provinces",
			"/api/v1/address/districts",
			"/api/v1/address/communes",
			"/api/v1/address/delivery",

			// comment
			"/api/v1/comment/create",
			"/api/v1/comment/read",

			// order
			"/api/v1/order"
	};

	@Bean
	@Order(1)
	public SecurityFilterChain securityFilterChain(HttpSecurity http, HttpSecurity httpSecurity) throws Exception {
		http
				.authorizeHttpRequests(authorize -> authorize

						// public paths
						.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
						.requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS).permitAll()
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

//	private RSAPublicKey getPublicKey() throws Exception {
//		Resource resource = new ClassPathResource(publicKey);
//		byte[] keyBytes = Files.readAllBytes(resource.getFile().toPath());
//		X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
//		KeyFactory kf = KeyFactory.getInstance("RSA");
//		return (RSAPublicKey) kf.generatePublic(spec);
//	}
//
//	private RSAPrivateKey getPrivateKey() throws Exception {
//		Resource resource = new ClassPathResource(privateKeyPath);
//		byte[] keyBytes = Files.readAllBytes(resource.getFile().toPath());
//		PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
//		KeyFactory kf = KeyFactory.getInstance("RSA");
//		return (RSAPrivateKey) kf.generatePrivate(spec);
//	}
}
//	@Bean
//	public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
//		httpSecurity.authorizeHttpRequests(request ->
//				request
//						.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
//						.requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS).permitAll()
//						.anyRequest().authenticated());
//
//		httpSecurity.oauth2ResourceServer(oauth2 ->
//				oauth2.jwt(jwtConfigurer ->
//						jwtConfigurer.decoder(jwtDecoder())
////								.jwtAuthenticationConverter(jwtAuthenticationConverter())
//				)
//		);
//		httpSecurity.csrf(AbstractHttpConfigurer::disable);
//
//		return httpSecurity.build();
//	}
//	@Bean
//	JwtAuthenticationConverter jwtAuthenticationConverter(){
//		JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
//		jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
//
//		JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
//		jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
//
//		return jwtAuthenticationConverter;
//	}
//
//	@Bean
//	JwtDecoder jwtDecoder(){
//		SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
//		return NimbusJwtDecoder
//				.withSecretKey(secretKeySpec)
//				.macAlgorithm(MacAlgorithm.HS512)
//				.build();
//	}
//
//	@Bean
//	PasswordEncoder passwordEncoder(){
//		return new BCryptPasswordEncoder(10);
//	}