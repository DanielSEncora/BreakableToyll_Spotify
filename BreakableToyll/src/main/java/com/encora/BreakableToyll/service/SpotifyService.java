package com.encora.BreakableToyll.service;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;
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

@Service
public class SpotifyService {

    private static String client_id = "8f488a66542545c6ae38ec67f8245952";
    private static String client_secret = "a9bafcd9d7574409be3f65b8e7430af7";
    private static String code = "";
    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:9090/Sparktify/get-user-code");

    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
            .setClientId(client_id)
            .setClientSecret(client_secret)
            .setRedirectUri(redirectUri)
            .build();

    public SpotifyService() throws IOException, InterruptedException {

    }

    public String login(){
        AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
                .scope("user-read-private, user-read-email, user-top-read")
                .show_dialog(true)
                .build();
        final URI uri = authorizationCodeUriRequest.execute();
         return uri.toString();
    }

    public String getUserAccessToken(String userCode, HttpServletResponse response) throws IOException, InterruptedException {
        code = userCode;
        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code)
                .build();

        try{
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());

        } catch(IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e){
            System.out.println("Error: " + e.getMessage());
        }

        response.sendRedirect("http://localhost:8080/homepage");
        return spotifyApi.getAccessToken();
    }

    public String getArtist(String artistURL) throws IOException, InterruptedException, URISyntaxException {

        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://api.spotify.com/v1/artists/" + artistURL))
                .header("Authorization", "Bearer " + spotifyApi.getAccessToken())
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

    public String getArtistTopTracks(String artistURL) throws IOException, InterruptedException, URISyntaxException  {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://api.spotify.com/v1/artists/" + artistURL + "/top-tracks"))
                .header("Authorization", "Bearer " + spotifyApi.getAccessToken())
                .GET() //GET is the default so no need to specify, just did it here for learning purposes.
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            return response.body();
        } else {
            throw new IOException("Failed to get artist's top tracks: " + response.body());
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
            System.out.println(artistPaging.getItems());
            return artistPaging.getItems();
        } catch (Exception e){
            System.out.println("Something went wrong! " + e.getMessage());
            System.out.println("Token locally saved in the Service Class: " + code);
            System.out.println("spotifyApi Token: " + spotifyApi.getAccessToken());
            System.out.println();
        }
        System.out.println(new Artist[0]);
        return new Artist[0];
    }

    public Object getAlbum(String albumURL) throws IOException, InterruptedException, URISyntaxException  {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://api.spotify.com/v1/albums/" + albumURL))
                .header("Authorization", "Bearer " + spotifyApi.getAccessToken())
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
