package com.encora.BreakableToyll.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

@Service
public class SpotifyService {

    private static String client_id = "8f488a66542545c6ae38ec67f8245952";
    private static String client_secret = "a9bafcd9d7574409be3f65b8e7430af7";
    private static String accessToken = "";
    private static String scope = "user-top-read";
    private static String redirect_uri = "http://localhost:8080/Sparktify";

    public SpotifyService() throws IOException, InterruptedException {
        getAccessToken();
    }

    public String getWelcome(){
        return "Welcome to the Spotify App";
    }

    public String getTest(){
        return "Welcome to the Test App";
    }

    public String getAccessToken() throws IOException, InterruptedException {
        if (accessToken.equals("")) {
            requestAccessToken();
        }
        return accessToken;
    }

    public String getUserAccessToken() throws IOException, InterruptedException {
        if (accessToken.equals("")) {
            requestUserAccessToken();
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
            System.out.println("Access Token = " + accessToken);
            //accessToken = new AccessToken(responseJson.get("access_token").asText());
        } else {
            throw new IOException("Failed to get access token: " + response.body());
        }
    }

    public void requestUserAccessToken() throws IOException, InterruptedException {
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
            System.out.println("Access Token = " + accessToken);
            //accessToken = new AccessToken(responseJson.get("access_token").asText());
        } else {
            throw new IOException("Failed to get access token: " + response.body());
        }
    }

    public String getArtist(String artistURL) throws IOException, InterruptedException, URISyntaxException {

        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://api.spotify.com/v1/artists/" + artistURL))
                .header("Authorization", "Bearer " + getAccessToken())
                .GET() //GET is the default so no need to specify, just did it here for learning purposes.
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            return response.body();
        } else {
            throw new IOException("Failed to get artist: " + response.body());
        }
    }

    public Object getMe() throws URISyntaxException, IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://api.spotify.com/v1/me"))
                .header("Authorization", "Bearer " + getAccessToken())
                .GET() //GET is the default so no need to specify, just did it here for learning purposes.
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            return response.body();
        } else {
            throw new IOException("Failed to get me: " + response.body());
        }
    }

    public Object getTopArtists() throws URISyntaxException, IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://api.spotify.com/v1/me/top/artists"))
                .header("Authorization", "Bearer " + getAccessToken())
                .GET() //GET is the default so no need to specify, just did it here for learning purposes.
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            return response.body();
        } else {
            throw new IOException("Failed to get topArtists: " + response.body());
        }
    }

    public Object getAlbum(String albumURL) throws IOException, InterruptedException, URISyntaxException  {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://api.spotify.com/v1/albums/" + albumURL))
                .header("Authorization", "Bearer " + getAccessToken())
                .GET() //GET is the default so no need to specify, just did it here for learning purposes.
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            return response.body();
        } else {
            throw new IOException("Failed to get album: " + response.body());
        }
    }

    public Object search() {

        return null;
    }
}
