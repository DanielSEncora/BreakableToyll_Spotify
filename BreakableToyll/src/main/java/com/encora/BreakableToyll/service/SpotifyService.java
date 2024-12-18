package com.encora.BreakableToyll.service;

import com.encora.BreakableToyll.model.AccessToken;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

@Service
public class SpotifyService {

    private static String client_id = "8f488a66542545c6ae38ec67f8245952";
    private static String client_secret = "a9bafcd9d7574409be3f65b8e7430af7";
    private static Object accessToken = null;

    public SpotifyService(){}

    public String getWelcome(){
        return "Welcome to the Spotify App";
    }

    public String getTest(){
        return "Welcome to the Test App";
    }

    public Object getAccessToken() throws IOException, InterruptedException {
        if (accessToken == null) {
            requestAccessToken();
        }
        return accessToken;
    }

    public void requestAccessToken() throws IOException, InterruptedException {
        String clientCredentials = client_id + ":" + client_secret;
        String encodedCredentials = Base64.getEncoder().encodeToString(clientCredentials.getBytes());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://accounts.spotify.com/api/token"))
                .header("Authorization", "Basic " + encodedCredentials)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString("grant_type=client_credentials"))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode responseJson = objectMapper.readTree(response.body());
            accessToken = responseJson.get("access_token").asText();
            //accessToken = new AccessToken(responseJson.get("access_token").asText());
        } else {
            throw new IOException("Failed to get access token: " + response.body());
        }
    }

    public String getArtist(){
        //spotifyAPI(getAccessToken(),"Kanye");
        return null;
    }
}
