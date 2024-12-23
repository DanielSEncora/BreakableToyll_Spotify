package com.encora.BreakableToyll.controller;

import com.encora.BreakableToyll.model.AccessToken;
import com.encora.BreakableToyll.service.SpotifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequestMapping("Sparktify")
public class SpotifyController {

    private final SpotifyService spotifyService;

    @Autowired
    public SpotifyController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    @GetMapping()
    public ResponseEntity<String> getWelcome(){
        return ResponseEntity.ok(spotifyService.getWelcome());
    }

    @GetMapping("get-user-code")
    public ResponseEntity<String> getUserCode() throws IOException, InterruptedException {
        return ResponseEntity.ok(spotifyService.getUserAccessToken());
    }

    @GetMapping("me/top/artists")
    public ResponseEntity<Object> getUserTopArtists() throws URISyntaxException, IOException, InterruptedException {
        return ResponseEntity.ok(spotifyService.getTopArtists());
    }

    @GetMapping("me")
    public ResponseEntity<Object> getMe() throws URISyntaxException, IOException, InterruptedException {
        return ResponseEntity.ok(spotifyService.getMe());
    }

    @GetMapping("artists/{id}")
    public ResponseEntity<Object> getArtists(@PathVariable String id) throws IOException, InterruptedException, URISyntaxException {
        return ResponseEntity.ok(spotifyService.getArtist(id));
    }

    @GetMapping("albums/{id}")
    public ResponseEntity<Object> getAlbum(@PathVariable String id) throws IOException, URISyntaxException, InterruptedException {
        return ResponseEntity.ok(spotifyService.getAlbum(id));
    }

    @GetMapping("search")
    public ResponseEntity<Object> searchArtist(){
        return ResponseEntity.ok(spotifyService.search());
    }

    @GetMapping("accessToken")
    public ResponseEntity<Object> getAccessTokenOnBrowser() throws IOException, InterruptedException {
        return ResponseEntity.ok().body(spotifyService.getAccessToken());
    }

    @PostMapping("auth/spotify")
    public ResponseEntity<Object> getAccessToken() throws IOException, InterruptedException {
        return ResponseEntity.ok().body(spotifyService.getAccessToken());
    }
}
