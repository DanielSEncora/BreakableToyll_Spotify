package com.encora.BreakableToyll.controller;

import com.encora.BreakableToyll.service.SpotifyService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequestMapping("Sparktify")
@CrossOrigin(origins ="http://localhost:8080")
public class SpotifyController {

    private final SpotifyService spotifyService;

    @Autowired
    public SpotifyController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    @GetMapping("login")
    @ResponseBody
    public ResponseEntity<String> spotifyLogin(){
        return ResponseEntity.ok(spotifyService.login());
    }

    @GetMapping("get-user-code")
    public ResponseEntity<String> getSpotifyUserCode(@RequestParam("code") String userCode, HttpServletResponse response) throws IOException, InterruptedException {
        return ResponseEntity.ok(spotifyService.getUserAccessToken(userCode,response));
    }

    @GetMapping("me/top/artists")
    public ResponseEntity<Object> getUserTopArtists() throws URISyntaxException, IOException, InterruptedException {
        return ResponseEntity.ok(spotifyService.getTopArtists());
    }

    @GetMapping("artists/{id}")
    public ResponseEntity<Object> getArtists(@PathVariable String id) throws IOException, InterruptedException, URISyntaxException {
        return ResponseEntity.ok(spotifyService.getArtist(id));
    }

    @GetMapping("artists/{id}/top-tracks")
    public ResponseEntity<Object> getArtistsTopTracks(@PathVariable String id) throws IOException, InterruptedException, URISyntaxException {
        return ResponseEntity.ok(spotifyService.getArtistTopTracks(id));
    }

    @GetMapping("artists/{id}/albums")
    public ResponseEntity<Object> getArtistAlbums(@PathVariable String id) throws IOException, URISyntaxException, InterruptedException {
        return ResponseEntity.ok(spotifyService.getArtistAlbums(id));
    }

    @GetMapping("albums/{id}")
    public ResponseEntity<Object> getAlbum(@PathVariable String id) throws IOException, URISyntaxException, InterruptedException {
        return ResponseEntity.ok(spotifyService.getAlbum(id));
    }



    @GetMapping("search")
    public ResponseEntity<Object> searchArtist(){
        return ResponseEntity.ok(spotifyService.search());
    }
}
