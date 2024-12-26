package com.encora.BreakableToyll.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.model_objects.specification.Artist;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import se.michaelthelin.spotify.requests.data.personalization.simplified.GetUsersTopArtistsRequest;

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
    private static String code = "";
    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:9090/Sparktify/get-user-code");

    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
            .setClientId(client_id)
            .setClientSecret(client_secret)
            .setRedirectUri(redirectUri)
            .build();

    public SpotifyService() throws IOException, InterruptedException {
        getAccessToken();
    }

    public String getWelcome(){
        return "Welcome to the Spotify App";
    }

    public String login(){
        AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
                .scope("user-read-private, user-read-email, user-top-read")
                .show_dialog(true)
                .build();
        final URI uri = authorizationCodeUriRequest.execute();
         return uri.toString();
    }

    public String getAccessToken() throws IOException, InterruptedException {
        if (accessToken.equals("")) {
            requestAccessToken();
        }
        return accessToken;
    }

    public String getUserAccessToken(String userCode, HttpServletResponse response) throws IOException, InterruptedException {
        code = userCode;
        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code)
                .build();

        try{
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

            //Set access and refresh token for further "spotifyApi" object usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApi.setAccessToken(authorizationCodeCredentials.getRefreshToken());
        } catch(IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e){
            System.out.println("Error: " + e.getMessage());
        }

        response.sendRedirect("http://localhost:9090/Sparktify/me/top/artists");
        System.out.println("New User code = " + spotifyApi.getAccessToken());
        return spotifyApi.getAccessToken();
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

    public Artist[] getTopArtists() throws URISyntaxException, IOException, InterruptedException {
        final GetUsersTopArtistsRequest getUsersTopArtistsRequest = spotifyApi.getUsersTopArtists()
                .time_range("medium_term")
                .limit(10)
                .offset(5)
                .build();

        try{
            final Paging<Artist> artistPaging = getUsersTopArtistsRequest.execute();

            // return top artists as JSON
            return artistPaging.getItems();
        } catch (Exception e){
            System.out.println("Something went wrong! " + e.getMessage());
        }
        return new Artist[0];
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
